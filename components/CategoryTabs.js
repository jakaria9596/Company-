'use client';

import Link from 'next/link';

export default function CategoryTabs({ locale, categories, active }) {
  return (
    <div className="flex gap-5 px-4 overflow-x-auto pb-2 -mx-4" style={{ scrollbarWidth: 'none' }}>
      <Link
        href={`/${locale}`}
        className="shrink-0 pb-1 text-sm whitespace-nowrap font-semibold"
        style={{
          color: !active ? '#1A1A1A' : '#9A9A9A',
          borderBottom: !active ? '2px solid #0C6B4F' : '2px solid transparent',
        }}
      >
        {locale === 'bn' ? 'সব' : 'All'}
      </Link>
      {categories.map((c) => (
        <Link
          key={c}
          href={`/${locale}/category/${encodeURIComponent(c)}`}
          className="shrink-0 pb-1 text-sm whitespace-nowrap font-semibold"
          style={{
            color: active === c ? '#1A1A1A' : '#9A9A9A',
            borderBottom: active === c ? '2px solid #0C6B4F' : '2px solid transparent',
          }}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
