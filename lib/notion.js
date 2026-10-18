import { cache } from 'react';
import { ACTIVE_CATEGORIES } from './categories';

const NOTION_VERSION = '2022-06-28';
const LIST_TTL = 300; // post lists: 5 minutes
const BLOCKS_TTL = 3600; // post bodies: 1 hour (cache key changes whenever the page is edited)

// One Notion database per category. To activate a new category, add its database ID here
// and set `active: true` in lib/categories.js.
const DB_IDS = {
  news: '3bdae239e6da800c89b2d7f942d2f185',
  corporate: '3c5ae239e6da8081869ece4556f850a8',
  finance: '3fdae239e6da80a3a945de6d10dda55a',
  'movie-review': '3fdae239e6da805790c3ca4d750c6e34',
  islamic: '3fdae239e6da80f69983faf35f8a9d60',
};

/* ------------------------------------------------------------------ */
/* Cache: Cloudflare Cache API (shared across requests) + in-memory    */
/* ------------------------------------------------------------------ */

const mem = new Map();

function edgeCache() {
  try {
    return typeof caches !== 'undefined' ? caches.default : null;
  } catch (e) {
    return null;
  }
}

async function cached(key, ttlSeconds, loader) {
  const now = Date.now();
  const hot = mem.get(key);
  if (hot && now - hot.t < ttlSeconds * 1000) return hot.v;

  const store = edgeCache();
  const req = new Request(`https://cache.bizkotha.internal/${encodeURIComponent(key)}`);

  if (store) {
    try {
      const hit = await store.match(req);
      if (hit) {
        const v = await hit.json();
        mem.set(key, { v, t: now });
        return v;
      }
    } catch (e) {}
  }

  let value;
  try {
    value = await loader();
  } catch (e) {
    // Notion is down or rate-limited: serve the last good copy if we have one.
    if (hot) return hot.v;
    throw e;
  }

  mem.set(key, { v: value, t: now });
  if (store) {
    try {
      await store.put(
        req,
        new Response(JSON.stringify(value), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${ttlSeconds}`,
          },
        })
      );
    } catch (e) {}
  }
  return value;
}

/* ------------------------------------------------------------------ */
/* Notion API                                                          */
/* ------------------------------------------------------------------ */

async function notion(path, options = {}) {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN is not set');
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Notion ${res.status} on ${path}`);
  return res.json();
}

async function queryAll(databaseId) {
  const results = [];
  let cursor;
  for (let i = 0; i < 10; i++) {
    const data = await notion(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    results.push(...(data.results || []));
    if (!data.has_more) break;
    cursor = data.next_cursor;
  }
  return results;
}

function plainText(richTextArr) {
  if (!richTextArr || !richTextArr.length) return '';
  return richTextArr.map((t) => t.plain_text).join('');
}

function getFeaturedFile(page) {
  const f = page.properties?.['Featured Image']?.files?.[0];
  if (!f) return null;
  return f.type === 'external' ? f.external?.url || null : f.file?.url || null;
}

function mapPage(page, categorySlug) {
  const p = page.properties || {};
  const titleProp = p['Name'] || p['Title'];
  const language = (p['Language']?.select?.name || '').toLowerCase();
  const edited = Date.parse(page.last_edited_time) || 0;
  const slug = p['Slug']?.rich_text ? plainText(p['Slug'].rich_text).trim() : '';
  const metaDescription = p['Meta Description']?.rich_text ? plainText(p['Meta Description'].rich_text) : '';

  return {
    id: page.id,
    title: titleProp?.title ? plainText(titleProp.title) : '',
    slug,
    author: p['Author']?.rich_text ? plainText(p['Author'].rich_text) : '',
    metaDescription,
    excerpt: metaDescription,
    publishedDate: p['Published Date']?.date?.start || '',
    lastEdited: page.last_edited_time || '',
    // Served through /img/<pageId> (resized + cached at the edge). `v` busts the cache when the page is edited.
    image: getFeaturedFile(page) ? `/img/${page.id}?v=${edited}` : '',
    categorySlug,
    tags: [],
    _status: p['Status']?.select?.name || '',
    _lang: language === 'bangla' || language === 'bengali' ? 'bn' : language === 'english' ? 'en' : '',
  };
}

const loadCategory = (slug) =>
  cached(`list:${slug}`, LIST_TTL, async () => {
    const pages = await queryAll(DB_IDS[slug]);
    return pages.map((pg) => mapPage(pg, slug));
  });

async function loadAllPublished() {
  const settled = await Promise.allSettled(
    ACTIVE_CATEGORIES.filter((c) => DB_IDS[c.slug]).map((c) => loadCategory(c.slug))
  );
  return settled
    .filter((s) => s.status === 'fulfilled')
    .flatMap((s) => s.value)
    .filter((a) => a._status === 'Published' && a.slug && a.title);
}

/* ------------------------------------------------------------------ */
/* Public API (React cache() = one Notion read per request)            */
/* ------------------------------------------------------------------ */

export const getAllArticles = cache(async (locale) => {
  const all = await loadAllPublished();
  const labels = Object.fromEntries(ACTIVE_CATEGORIES.map((c) => [c.slug, locale === 'bn' ? c.bn : c.en]));
  return all
    .filter((a) => a._lang === locale)
    .map((a) => ({ ...a, category: labels[a.categorySlug] || a.categorySlug }))
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
});

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch (e) {
    return s;
  }
}

export const getArticleBySlug = cache(async (slug, locale) => {
  const want = safeDecode(slug).toLowerCase();
  const articles = await getAllArticles(locale);
  const found = articles.find((a) => a.slug.toLowerCase() === want);
  if (!found) return null;

  const version = Date.parse(found.lastEdited) || 0;
  const content = await cached(`blocks:${found.id}:${version}`, BLOCKS_TTL, () => loadContent(found.id));
  return { ...found, content };
});

// Used by /img/<pageId>: only published posts' images are ever served.
export async function getPublishedImageUrl(pageId) {
  const all = await loadAllPublished();
  if (!all.some((a) => a.id === pageId)) return null;
  const page = await notion(`/pages/${pageId}`);
  return getFeaturedFile(page);
}

/* ------------------------------------------------------------------ */
/* Notion blocks -> lightweight markdown (see lib/formatContent.js)    */
/* ------------------------------------------------------------------ */

function richToMarkdown(arr) {
  if (!arr || !arr.length) return '';
  return arr
    .map((t) => {
      let text = t.plain_text || '';
      if (!text.trim()) return text;
      if (t.annotations?.bold) text = text.replace(/^(\s*)(.*?)(\s*)$/s, '$1**$2**$3');
      const href = t.href;
      if (href && /^(https?:\/\/|\/)/.test(href)) text = `[${text.trim()}](${href})`;
      return text;
    })
    .join('');
}

async function loadContent(pageId) {
  const blocks = [];
  let cursor;
  for (let i = 0; i < 5; i++) {
    const data = await notion(
      `/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`
    );
    blocks.push(...(data.results || []));
    if (!data.has_more) break;
    cursor = data.next_cursor;
  }

  const out = [];
  let numbered = 0;
  let prevList = null;
  for (const b of blocks) {
    const rt = b[b.type]?.rich_text;
    const text = richToMarkdown(rt).trim();
    if (b.type !== 'numbered_list_item') numbered = 0;
    if (!text) {
      prevList = null;
      continue;
    }

    let line;
    let kind = 'block';
    if (b.type === 'heading_1' || b.type === 'heading_2') line = `## ${text}`;
    else if (b.type === 'heading_3') line = `### ${text}`;
    else if (b.type === 'bulleted_list_item') {
      line = `- ${text}`;
      kind = 'ul';
    } else if (b.type === 'numbered_list_item') {
      numbered += 1;
      line = `${numbered}. ${text}`;
      kind = 'ol';
    } else if (b.type === 'quote') line = `> ${text}`;
    else line = text;

    if (kind !== 'block' && prevList === kind) out[out.length - 1] += `\n${line}`;
    else out.push(line);
    prevList = kind === 'block' ? null : kind;
  }
  return out.join('\n\n');
}
