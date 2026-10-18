export const runtime = 'edge';

import { getAllArticles } from '../../../lib/notion';
import { getDictionary } from '../../../lib/dictionary';
import ArticleCard from '../../../components/ArticleCard';

const SITE_URL = 'https://bizkotha.com';

export async function generateMetadata({ params: { locale } }) {
  const dict = getDictionary(locale);
  return {
    title: dict.nav.blog,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: { bn: `${SITE_URL}/bn/blog`, en: `${SITE_URL}/en/blog`, 'x-default': `${SITE_URL}/bn/blog` },
    },
  };
}

export default async function BlogIndexPage({ params: { locale } }) {
  const dict = getDictionary(locale);
  let articles = [];
  try {
    articles = await getAllArticles(locale);
  } catch (e) {}

  return (
    <div>
      <h1 className="font-display-en text-3xl font-black text-ink mb-8 pb-4 rule-double">
        {dict.nav.blog}
      </h1>
      {articles.length === 0 ? (
        <p className="text-ink-soft text-sm">{dict.empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
