import Link from 'next/link';

export default function ArticleCard({ article, locale, big = false }) {
  return (
    <Link href={`/${locale}/blog/${article.slug}`} className="block group">
      <div
        className={`w-full ${big ? 'h-44' : 'h-28'} rounded-2xl overflow-hidden bg-cardbg flex items-center justify-center`}
      >
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-300 text-xs">{article.category}</span>
        )}
      </div>
      <div className="pt-2 pr-1">
        <span className="text-[10px] font-bold tracking-wide text-accent">
          {article.category}
        </span>
        <p
          className={`mt-1 leading-snug font-bold text-ink ${big ? 'text-[15px]' : 'text-[13px]'} line-clamp-2`}
        >
          {article.title}
        </p>
      </div>
    </Link>
  );
}
