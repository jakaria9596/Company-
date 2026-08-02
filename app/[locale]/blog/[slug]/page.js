export const runtime = 'edge';

import { getArticleBySlug, getAllArticles } from '../../../../lib/sheets';
import { getDictionary } from '../../../../lib/dictionary';
import { formatContent } from '../../../../lib/formatContent';
import ArticleCard from '../../../../components/ArticleCard';
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
    .slice(0, 3);

  if (related.length === 0) {
    related = allArticles.filter((a) => a.slug !== slug).slice(0, 3);
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
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="stamp mb-5">
        {dict.fileNo} &middot; {article.companyName || article.category}
      </div>

      <h1 className="font-display-en text-3xl md:text-4xl font-black text-ink leading-tight mb-4">
        {article.title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 font-mono text-[11px] uppercase tracking-wider text-ink-soft border-y border-ink/30 py-3">
        {article.founded && <div><span className="text-brass">{dict.founded}:</span> {article.founded}</div>}
        {article.headquarters && <div><span className="text-brass">{dict.headquarters}:</span> {article.headquarters}</div>}
        {article.sector && <div><span className="text-brass">{dict.sector}:</span> {article.sector}</div>}
      </div>

      {article.image && (
        <div className="relative w-full aspect-video mb-8 border-2 border-ink/80 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="prose-custom leading-relaxed text-ink space-y-4 [&_h2]:font-display-en [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-6"
        dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
      />

      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10">
          {article.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] uppercase border border-brass text-brass px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-brass mb-4">{dict.relatedFiles}</h2>
          {related.map((a, i) => (
            <ArticleCard key={a.slug} article={a} locale={locale} dict={dict} index={i} />
          ))}
        </div>
      )}
    </article>
  );
}
