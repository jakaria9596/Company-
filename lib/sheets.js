import Papa from 'papaparse';

const SHEET_CSV_URL = process.env.SHEET_CSV_URL;

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 5 * 1000;

async function fetchRows() {
  if (!SHEET_CSV_URL) {
    throw new Error(
      'SHEET_CSV_URL is not set. Add it to your .env / Cloudflare Pages environment variables.'
    );
  }

  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  const res = await fetch(SHEET_CSV_URL, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  const csvText = await res.text();

  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  cache = data;
  cacheTime = now;
  return data;
}

// company_name থেকে অটোমেটিক URL-friendly slug বানায়
function slugify(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toArticle(row, locale) {
  const t = locale === 'bn' ? '_bn' : '_en';
  const slug = row.slug?.trim() || slugify(row.company_name);
  return {
    slug,
    companyName: row.company_name?.trim() || '',
    category: row.category?.trim() || '',
    tags: (row.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    image: row.featured_image?.trim() || '',
    author: row.author?.trim() || '',
    publishedDate: row.published_date?.trim() || '',
    founded: row.founded_year?.trim() || '',
    headquarters: row.headquarters?.trim() || '',
    sector: row.sector?.trim() || '',
    title: row[`title${t}`]?.trim() || '',
    excerpt: row[`excerpt${t}`]?.trim() || '',
    content: row[`content${t}`] || '',
    metaDescription: row[`meta_description${t}`]?.trim() || '',
  };
}

export async function getAllArticles(locale) {
  const rows = await fetchRows();
  return rows
    .filter((r) => r.company_name)
    .map((r) => toArticle(r, locale))
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export async function getArticleBySlug(slug, locale) {
  const articles = await getAllArticles(locale);
  return articles.find((a) => a.slug === slug) || null;
}

export async function getAllSlugs() {
  const rows = await fetchRows();
  return rows
    .filter((r) => r.company_name)
    .map((r) => r.slug?.trim() || slugify(r.company_name));
}
