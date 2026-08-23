const NOTION_VERSION = '2022-06-28';

const DATABASES = [
  { id: '3bdae239e6da800c89b2d7f942d2f185', slug: 'news', bn: 'নিউজ', en: 'News' },
  { id: '3c5ae239e6da8081869ece4556f850a8', slug: 'corporate', bn: 'কর্পোরেট', en: 'Corporate' },
];

async function queryDatabase(databaseId, token) {
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

async function getBlockChildren(pageId, token) {
  const res = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

function plainText(richTextArr) {
  if (!richTextArr || !richTextArr.length) return '';
  return richTextArr.map((t) => t.plain_text).join('');
}

function mapPage(page, dbMeta) {
  const p = page.properties || {};
  const titleProp = p['Name'] || p['Title'];
  const title = titleProp?.title ? plainText(titleProp.title) : '';
  const slug = p['Slug']?.rich_text ? plainText(p['Slug'].rich_text) : '';
  const author = p['Author']?.rich_text ? plainText(p['Author'].rich_text) : '';
  const metaDescription = p['Meta Description']?.rich_text ? plainText(p['Meta Description'].rich_text) : '';
  const language = p['Language']?.select?.name || '';
  const status = p['Status']?.select?.name || '';
  const publishedDate = p['Published Date']?.date?.start || '';
  const fileEntry = p['Featured Image']?.files?.[0];
  const image = fileEntry
    ? (fileEntry.type === 'external' ? fileEntry.external.url : fileEntry.file?.url)
    : null;

  return {
    id: page.id,
    title,
    slug: slug.trim(),
    author,
    metaDescription,
    excerpt: metaDescription,
    image,
    publishedDate,
    category: dbMeta.slug,
    categoryLabelBn: dbMeta.bn,
    categoryLabelEn: dbMeta.en,
    tags: [],
    _status: status,
    _language: language.toLowerCase(),
  };
}

function languageMatches(article, locale) {
  const want = locale === 'bn' ? 'bangla' : 'english';
  return article._language === want;
}

export async function getAllArticles(locale) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return [];

  const all = [];
  for (const db of DATABASES) {
    const pages = await queryDatabase(db.id, token);
    for (const page of pages) {
      const article = mapPage(page, db);
      if (article._status !== 'Published') continue;
      if (!languageMatches(article, locale)) continue;
      if (!article.slug || !article.title) continue;
      article.category = locale === 'bn' ? article.categoryLabelBn : article.categoryLabelEn;
      article.categorySlug = db.slug;
      all.push(article);
    }
  }

  all.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
  return all;
}

export async function getArticleBySlug(slug, locale) {
  const articles = await getAllArticles(locale);
  const found = articles.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  if (!found) return null;

  const token = process.env.NOTION_TOKEN;
  const blocks = await getBlockChildren(found.id, token);
  const paragraphs = blocks
    .map((b) => {
      const rt = b[b.type]?.rich_text;
      return rt ? plainText(rt) : '';
    })
    .filter(Boolean);

  return { ...found, content: paragraphs.join('\n\n') };
      }
