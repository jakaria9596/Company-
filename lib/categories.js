// `active: false` categories are hidden everywhere (menu, tabs, sitemap) until a Notion database is connected.
// To activate one: add its database ID to DB_IDS in lib/notion.js and set active: true here.
export const CATEGORIES = [
  { slug: 'news', bn: 'নিউজ', en: 'News', active: true },
  { slug: 'corporate', bn: 'কর্পোরেট', en: 'Corporate', active: true },
  { slug: 'finance', bn: 'ফাইন্যান্স', en: 'Finance', active: false },
  { slug: 'movie-review', bn: 'মুভি রিভিউ', en: 'Movie Review', active: false },
  { slug: 'islamic', bn: 'ইসলামিক', en: 'Islamic', active: false },
];

export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => c.active);

export function getActiveCategory(slug) {
  return ACTIVE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function categoryLabel(category, locale) {
  return locale === 'bn' ? category.bn : category.en;
}
