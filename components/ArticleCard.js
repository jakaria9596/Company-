import Link from 'next/link';

export default function ArticleCard({ article, locale, dict, index }) {
  return (
    <Link
      href={`/${locale}/blog/${article.slug}`}
      className="block border-2 border-ink/80 bg-paper-alt/40 hover:bg-paper-alt transition-colors mb-5 overflow-hidden"
    >
      {article.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover border-b-2 border-ink/80"
        />
      )}

      <div className="p-5">
        <div className="font-mono text-[11px] text-brass tracking-widest mb-2">
          {dict.fileNo} {String(index + 1).padStart(3, '0')} &middot; {article.category}
        </div>
        <h2 className="font-display-en text-xl md:text-2xl font-semibold text-ink leading-snug">
          {article.title}
        </h2>
        <p className="text-ink-soft mt-2 text-sm leading-relaxed">{article.excerpt}</p>

        <div className="mt-4 font-mono text-[11px] uppercase tracking-wider text-navy">
          {dict.readMore} &rarr;
        </div>
      </div>
    </Link>
  );
}
