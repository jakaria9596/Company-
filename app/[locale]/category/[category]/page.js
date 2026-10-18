export const runtime = 'edge';

import { getAllArticles } from '../../../../lib/notion';
import { getActiveCategory } from '../../../../lib/categories';
import { getDictionary } from '../../../../lib/dictionary';
import ArticleCard from '../../../../components/ArticleCard';
import TrendingCarousel from '../../../../components/TrendingCarousel';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://bizkotha.com';
const PAGE_SIZE = 12;

async function readPage(searchParams) {
  const sp = (await searchParams) || {};
  return Math.max(1, parseInt(sp.page, 10) || 1);
}

export async function generateMetadata({ params: { locale, category }, searchParams }) {
  const cat = getActiveCategory(category);
  if (!cat) return {};
  const page = await readPage(searchParams);
  const dict = getDictionary(locale);
  const seo = cat.seo[locale];
  const base = `${SITE_URL}/${locale}/category/${cat.slug}`;
  const pageLabel = page > 1 ? (locale === 'bn' ? ` - পৃষ্ঠা ${page}` : ` - Page ${page}`) : '';
  const title = `${seo.title}${pageLabel}`;
  return {
    title,
    description: seo.description,
    alternates: {
      canonical: page > 1 ? `${base}?page=${page}` : base,
      languages: {
        bn: `${SITE_URL}/bn/category/${cat.slug}`,
        en: `${SITE_URL}/en/category/${cat.slug}`,
        'x-default': `${SITE_URL}/bn/category/${cat.slug}`,
      },
    },
    openGraph: {
      title: `${title} | ${dict.siteName}`,
      description: seo.description,
      url: base,
      type: 'website',
    },
    twitter: { card: 'summary', title: `${title} | ${dict.siteName}`, description: seo.description },
  };
}

export default async function CategoryPage({ params: { locale, category }, searchParams }) {
  const cat = getActiveCategory(category);
  if (!cat) notFound();

  const page = await readPage(searchParams);
  const dict = getDictionary(locale);
  const seo = cat.seo[locale];
  const base = `${SITE_URL}/${locale}/category/${cat.slug}`;

  let allArticles = [];
  try {
    allArticles = await getAllArticles(locale);
  } catch (e) {}

  const filtered = allArticles.filter((a) => a.categorySlug === cat.slug);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (page > totalPages) notFound();

  const trending = page === 1 ? filtered.slice(0, 5) : [];
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: seo.h1,
      description: seo.description,
      url: base,
      inLanguage: locale,
      isPartOf: { '@type': 'WebSite', name: 'Bizkotha', url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: dict.nav.home, item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: locale === 'bn' ? cat.bn : cat.en, item: base },
      ],
    },
  ];

  return (
    <div className="-mx-5 md:mx-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="px-4 md:px-0 pt-4">
        <h1 className="font-display-en text-xl md:text-3xl font-black text-ink leading-snug">{seo.h1}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{seo.intro}</p>
      </div>
      <TrendingCarousel articles={trending} locale={locale} />
      <div className="px-4 md:px-0 mt-5">
        {visible.length === 0 ? (
          <p className="text-ink-soft text-sm">{dict.empty}</p>
        ) : (
          <PostGrid articles={visible} locale={locale} />
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-between mt-8 text-[13px] font-bold text-ink" aria-label="Pagination">
            {page > 1 ? (
              <Link
                href={page === 2 ? `/${locale}/category/${cat.slug}` : `/${locale}/category/${cat.slug}?page=${page - 1}`}
                rel="prev"
              >
                ← {locale === 'bn' ? 'আগের পাতা' : 'Previous'}
              </Link>
            ) : (
              <span />
            )}
            <span className="text-ink-soft font-normal">
              {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={`/${locale}/category/${cat.slug}?page=${page + 1}`} rel="next">
                {locale === 'bn' ? 'পরের পাতা' : 'Next'} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
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
