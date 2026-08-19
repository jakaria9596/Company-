export const runtime = 'edge';

import { getAllArticles } from '../../lib/sheets';
import ArticleCard from '../../components/ArticleCard';
import CategoryTabs from '../../components/CategoryTabs';
import TrendingCarousel from '../../components/TrendingCarousel';

export const revalidate = 300;

export default async function HomePage({ params: { locale } }) {
  let articles = [];
  try {
    articles = await getAllArticles(locale);
  } catch (e) {}

  const categories = [...new Set(articles.map((a) => a.category).filter((c) => c && c.length <= 25))];
  const trending = articles.slice(0, 5);
  const rest = articles.slice(0, 12);

  return (
    <div className="-mx-5 md:mx-0">
      <div className="px-1">
        <CategoryTabs locale={locale} categories={categories} active={null} />
      </div>

      <TrendingCarousel articles={trending} locale={locale} />

      <div className="px-4 md:px-0 mt-5">
        {rest.length === 0 ? (
          <p className="text-ink-soft text-sm">
            {locale === 'bn' ? 'এখনো কোনো ফাইল যুক্ত হয়নি।' : 'No stories yet.'}
          </p>
        ) : (
          <PostGrid articles={rest} locale={locale} />
        )}
      </div>
    </div>
  );
}

function PostGrid({ articles, locale }) {
  const blocks = [];
  let i = 0;
  let big = false;
  while (i < articles.length) {
    if (big) {
      blocks.push(<div key={i} className="mt-5"><ArticleCard article={articles[i]} locale={locale} big /></div>);
      i += 1;
    } else {
      const pair = articles.slice(i, i + 2);
      blocks.push(
        <div key={i} className="grid grid-cols-2 gap-x-3 gap-y-5 mt-5">
          {pair.map((a) => (
            <ArticleCard key={a.slug} article={a} locale={locale} />
          ))}
        </div>
      );
      i += 2;
    }
    big = !big;
  }
  return <>{blocks}</>;
}
