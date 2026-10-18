export const runtime = 'edge';

import { getAllArticles } from '../../lib/notion';
import { getDictionary } from '../../lib/dictionary';
import ArticleCard from '../../components/ArticleCard';
import TrendingCarousel from '../../components/TrendingCarousel';

const SITE_URL = 'https://bizkotha.com';

export async function generateMetadata({ params: { locale } }) {
  const dict = getDictionary(locale);
  return {
    title: { absolute: dict.homeTitle },
    description: dict.homeDescription,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { bn: `${SITE_URL}/bn`, en: `${SITE_URL}/en`, 'x-default': `${SITE_URL}/bn` },
    },
    openGraph: { title: dict.homeTitle, description: dict.homeDescription, url: `${SITE_URL}/${locale}` },
  };
}

export default async function HomePage({ params: { locale } }) {
  const dict = getDictionary(locale);
  let articles = [];
  try {
    articles = await getAllArticles(locale);
  } catch (e) {}

  const trending = articles.slice(0, 5);
  const rest = articles.slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Bizkotha',
        alternateName: ['বিজকোঠা', 'Bizkotha.com'],
        description: dict.homeDescription,
        inLanguage: locale,
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Bizkotha',
        alternateName: 'বিজকোঠা',
        url: SITE_URL,
      },
    ],
  };

  return (
    <div className="-mx-5 md:mx-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">{dict.homeTitle}</h1>
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
