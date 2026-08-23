export const runtime = 'edge';

import { getAllArticles } from '../../../../lib/sheets';
import ArticleCard from '../../../../components/ArticleCard';
import TrendingCarousel from '../../../../components/TrendingCarousel';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export default async function CategoryPage({ params: { locale, category } }) {
  const decodedCategory = decodeURIComponent(category);

  let allArticles = [];
  try {
    allArticles = await getAllArticles(locale);
  } catch (e) {}

  const filtered = allArticles.filter(
    (a) => (a.category || '').trim().toLowerCase() === decodedCategory.trim().toLowerCase()
  );

  if (filtered.length === 0) notFound();

  const trending = filtered.slice(0, 5);
  const rest = filtered.slice(0, 12);

  return (
    <div className="-mx-5 md:mx-0">
      <TrendingCarousel articles={trending} locale={locale} />

      <div className="px-4 md:px-0 mt-5">
        <PostGrid articles={rest} locale={locale} />
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
