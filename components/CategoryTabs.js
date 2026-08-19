'use client';

import Link from 'next/link';

export default function CategoryTabs({ locale, categories, active }) {
  return (
    <div className="flex gap-5 px-4 overflow-x-auto pb-2 -mx-4" style={{ scrollbarWidth: 'none' }}>
      <Link
        href={`/${locale}`}
        className="shrink-0 pb-1 text-sm whitespace-nowrap"
        style={{
          color: !active ? '#1A1A1A' : '#B5B5B5',
          fontWeight: !active ? 800 : 500,
          borderBottom: !active ? '2px solid #1A1A1A' : '2px solid transparent',
        }}
      >
        {locale === 'bn' ? 'সব' : 'All'}
      </Link>
      {categories.map((c) => (
        <Link
          key={c}
          href={`/${locale}/category/${encodeURIComponent(c)}`}
          className="shrink-0 pb-1 text-sm whitespace-nowrap"
          style={{
            color: active === c ? '#1A1A1A' : '#B5B5B5',
            fontWeight: active === c ? 800 : 500,
            borderBottom: active === c ? '2px solid #1A1A1A' : '2px solid transparent',
          }}
        >
          {c}
        </Link>
      ))}
    </div>
  );
}
