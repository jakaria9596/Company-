import { getAllSlugs } from '../lib/sheets';

const SITE_URL = 'https://www.yourdomain.com'; // TODO: বদলে দিন

export default async function sitemap() {
  const staticPaths = ['', '/blog', '/about'];
  const locales = ['bn', 'en'];

  let slugs = [];
  try {
    slugs = await getAllSlugs();
  } catch (e) {
    slugs = [];
  }

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      changeFrequency: 'daily',
      priority: p === '' ? 1 : 0.7,
    }))
  );

  const articleEntries = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/blog/${slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...articleEntries];
}
