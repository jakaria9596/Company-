export const runtime = 'edge';

import { getAllArticles } from '../../../../lib/notion';
import { getActiveCategory, categoryLabel } from '../../../../lib/categories';
import { getDictionary } from '../../../../lib/dictionary';
import ArticleCard from '../../../../components/ArticleCard';
import TrendingCarousel from '../../../../components/TrendingCarousel';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://bizkotha.com';

export async function generateMetadata({ params: { locale, category } }) {
  const cat = getActiveCategory(category);
  if (!cat) return {};
  const label = categoryLabel(cat, locale);
  const dict = getDictionary(locale);
  const description =
    locale === 'bn'
      ? `বিজকোঠায় ${label} বিভাগের সর্বশেষ লেখা পড়ুন।`
      : `Read the latest ${label} stories on Bizkotha.`;
  return {
    title: label,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/category/${cat.slug}`,
      languages: {
        bn: `${SITE_URL}/bn/category/${cat.slug}`,
        en: `${SITE_URL}/en/category/${cat.slug}`,
        'x-default': `${SITE_URL}/bn/category/${cat.slug}`,
      },
    },
    openGraph: { title: `${label} | ${dict.siteName}`, description },
  };
}

export default async function CategoryPage({ params: { locale, category } }) {
  const cat = getActiveCategory(category);
  if (!cat) notFound();

  const dict = getDictionary(locale);
  let allArticles = [];
  try {
    allArticles = await getAllArticles(locale);
  } catch (e) {}

  const filtered = allArticles.filter((a) => a.categorySlug === cat.slug);
  const trending = filtered.slice(0, 5);
  const rest = filtered.slice(0, 12);

  return (
    <div className="-mx-5 md:mx-0">
      <h1 className="sr-only">{categoryLabel(cat, locale)}</h1>
      <TrendingCarousel articles={trending} locale={locale} />
      <div className="px-4 md:px-0 mt-5">
        {rest.length === 0 ? (
          <p className="text-ink-soft text-sm">{dict.empty}</p>
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
