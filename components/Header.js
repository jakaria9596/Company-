'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header({ locale, dict, categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white z-30 border-b border-line">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-display-en text-lg font-black text-ink">
          {dict.siteName}<span className="text-accent">.</span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menu"
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
        >
          <span className="w-5 h-[2px] bg-ink rounded-full" />
          <span className="w-5 h-[2px] bg-ink rounded-full" />
          <span className="w-5 h-[2px] bg-ink rounded-full" />
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute top-0 right-0 h-full w-72 max-w-[80%] bg-white shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display-en text-lg font-black text-ink">
                {dict.siteName}
              </span>
              <button onClick={() => setMenuOpen(false)} className="text-2xl text-ink-soft leading-none">
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                href={`/${locale}`}
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-line text-ink font-semibold"
              >
                {locale === 'bn' ? 'সব' : 'All'}
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/${locale}/category/${encodeURIComponent(c)}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 border-b border-line text-ink-soft font-medium"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
