export const runtime = 'edge';

import { getArticleBySlug, getAllArticles } from '../../../../lib/notion';
import { getDictionary } from '../../../../lib/dictionary';
import { formatContent } from '../../../../lib/formatContent';
import ArticleCard from '../../../../components/ArticleCard';
import { imgSrc, imgSrcSet } from '../../../../lib/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SITE_URL = 'https://bizkotha.com';

export async function generateMetadata({ params: { locale, slug } }) {
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};

  const description = article.metaDescription || article.excerpt;
  const url = `${SITE_URL}/${locale}/blog/${encodeURIComponent(article.slug)}`;
  const ogImage = article.image ? [`${SITE_URL}${article.image}&w=1280`] : [];

  return {
    title: article.title,
    description,
    // Each story exists in one language only, so no hreflang alternates here.
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      images: ogImage,
      type: 'article',
      publishedTime: article.publishedDate || undefined,
      modifiedTime: article.lastEdited || undefined,
    },
    twitter: { card: 'summary_large_image', title: article.title, description, images: ogImage },
  };
}

export default async function ArticlePage({ params: { locale, slug } }) {
  const dict = getDictionary(locale);
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();

  const allArticles = await getAllArticles(locale);
  let related = allArticles
    .filter((a) => a.slug !== article.slug && a.categorySlug === article.categorySlug)
    .slice(0, 4);
  if (related.length === 0) {
    related = allArticles.filter((a) => a.slug !== article.slug).slice(0, 4);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.image ? [`${SITE_URL}${article.image}&w=1280`] : undefined,
    datePublished: article.publishedDate,
    dateModified: article.lastEdited || article.publishedDate,
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${encodeURIComponent(article.slug)}`,
    publisher: { '@type': 'Organization', name: 'Bizkotha', url: SITE_URL },
    author: { '@type': 'Person', name: article.author || dict.siteName },
    inLanguage: locale,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category,
        item: `${SITE_URL}/${locale}/category/${article.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/${locale}/blog/${encodeURIComponent(article.slug)}`,
      },
    ],
  };

  return (
    <article className="-mx-5 md:mx-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }} />

      <div className="px-4 md:px-0 mb-3">
        <Link href={`/${locale}`} className="text-ink-soft text-sm">
          ← {dict.nav.home}
        </Link>
      </div>

      {article.image && (
        <div className="w-full aspect-video bg-cardbg overflow-hidden mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(article.image, 960)}
            srcSet={imgSrcSet(article.image, [480, 640, 960, 1280])}
            sizes="(min-width: 768px) 768px, 100vw"
            alt={article.title}
            width={1280}
            height={720}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="px-4 md:px-0">
        <Link
          href={`/${locale}/category/${article.categorySlug}`}
          className="text-[11px] font-bold tracking-wide text-accent"
        >
          {article.category}
        </Link>

        <h1 className="font-display-en text-2xl md:text-4xl font-black text-ink leading-snug mt-2 mb-3">
          {article.title}
        </h1>

        <div className="flex items-center gap-2 text-[12px] text-ink-soft mb-6">
          {article.author && <span>{article.author}</span>}
          {article.publishedDate && <span>•</span>}
          {article.publishedDate && <span>{article.publishedDate}</span>}
        </div>

        <div
          className="prose-custom leading-relaxed text-ink space-y-4 text-[15px] [&_h2]:font-display-en [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-6"
          dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
        />

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {article.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-accent bg-accent/10 rounded-full px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[13px] font-bold text-ink mb-4">{dict.relatedFiles}</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
