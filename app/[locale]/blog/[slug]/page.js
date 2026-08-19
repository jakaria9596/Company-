export const runtime = 'edge';

import { getArticleBySlug, getAllArticles } from '../../../../lib/sheets';
import { getDictionary } from '../../../../lib/dictionary';
import { formatContent } from '../../../../lib/formatContent';
import ArticleCard from '../../../../components/ArticleCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 300;

const SITE_URL = 'https://bizkotha.com';

export async function generateMetadata({ params: { locale, slug } }) {
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};

  return {
    title: article.title,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog/${slug}`,
      languages: { bn: `${SITE_URL}/bn/blog/${slug}`, en: `${SITE_URL}/en/blog/${slug}` },
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.excerpt,
      images: article.image ? [article.image] : [],
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params: { locale, slug } }) {
  const dict = getDictionary(locale);
  const article = await getArticleBySlug(slug, locale);
  if (!article) notFound();

  const allArticles = await getAllArticles(locale);
  const norm = (s) => (s || '').toLowerCase().trim();
  let related = allArticles
    .filter((a) => a.slug !== slug && norm(a.category) === norm(article.category))
    .slice(0, 4);
  if (related.length === 0) {
    related = allArticles.filter((a) => a.slug !== slug).slice(0, 4);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.image ? [article.image] : undefined,
    datePublished: article.publishedDate,
    author: { '@type': 'Person', name: article.author || dict.siteName },
    inLanguage: locale,
  };

  return (
    <article className="-mx-5 md:mx-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="px-4 md:px-0 mb-3">
        <Link href={`/${locale}`} className="text-ink-soft text-sm">
          ← {dict.nav.home}
        </Link>
      </div>

      {article.image && (
        <div className="w-full aspect-video bg-cardbg overflow-hidden mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-4 md:px-0">
        <span className="text-[11px] font-bold tracking-wide text-accent">
          {article.category}
        </span>

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
