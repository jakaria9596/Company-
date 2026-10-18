export const runtime = 'edge';

import { getAllArticles } from '../lib/notion';
import { ACTIVE_CATEGORIES } from '../lib/categories';

const SITE_URL = 'https://bizkotha.com';

export default async function sitemap() {
  const locales = ['bn', 'en'];
  const staticPaths = ['', '/blog', '/about', ...ACTIVE_CATEGORIES.map((c) => `/category/${c.slug}`)];

  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: `${SITE_URL}/${locale}${p}`,
      changeFrequency: 'daily',
      priority: p === '' ? 1 : 0.7,
    }))
  );

  // Every story lives in exactly one language, so it is listed only under its own locale.
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      try {
        const articles = await getAllArticles(locale);
        return articles.map((a) => ({
          url: `${SITE_URL}/${locale}/blog/${encodeURIComponent(a.slug)}`,
          lastModified: a.lastEdited ? new Date(a.lastEdited) : undefined,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
      } catch (e) {
        return [];
      }
    })
  );

  return [...staticEntries, ...perLocale.flat()];
}
