'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '../lib/categories';

export default function Header({ locale, dict }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLangOpen, setMenuLangOpen] = useState(null);
  const [catOpen, setCatOpen] = useState(null);

  return (
    <header className="sticky top-0 bg-white z-30 border-b border-line">
      <div className="max-w-3xl mx-auto flex items-center gap-2 px-4 py-3">
        <Link
          href={`/${locale}`}
          className="text-lg font-black tracking-tight shrink-0"
          style={{ color: '#141414', fontFamily: 'serif', letterSpacing: '-0.02em' }}
        >
          Bizkotha<span className="text-accent">.</span>
        </Link>

        <div
          className="flex items-center gap-1.5 px-2.5 rounded-full flex-1 min-w-0"
          style={{ background: '#F5F5F3', height: 28 }}
        >
          <span className="text-gray-400 text-[11px]">⌕</span>
          <input
            placeholder={dict.searchPlaceholder}
            className="bg-transparent outline-none text-[12px] flex-1 min-w-0 w-full"
          />
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="2" y1="5" x2="18" y2="5" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="2" y1="10" x2="18" y2="10" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="2" y1="15" x2="18" y2="15" stroke="#141414" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute top-[calc(100%+6px)] right-0 z-20 rounded-xl overflow-hidden shadow-xl border border-gray-100"
                style={{ width: 180, background: '#fff' }}
              >
                {CATEGORIES.map((c) => (
                  <div key={c.slug} style={{ borderBottom: '1px solid #F5F5F3' }}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${locale}/category/${c.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 text-left px-4 py-2.5 text-[13px] font-bold"
                        style={{ color: '#141414' }}
                      >
                        {c.en}
                      </Link>
                      <button
                        onClick={() => setMenuLangOpen(menuLangOpen === c.slug ? null : c.slug)}
                        className="px-3 py-2.5"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4L6 8L10 4" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    {menuLangOpen === c.slug && (
                      <div className="flex gap-2 px-4 pb-2.5">
                        <Link
                          href={`/bn/category/${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: '#F0F0EE', color: '#141414' }}
                        >
                          বাংলা
                        </Link>
                        <Link
                          href={`/en/category/${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-1 rounded-full text-[11px] font-bold"
                          style={{ background: '#F0F0EE', color: '#141414' }}
                        >
                          English
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="flex gap-1 px-2 pb-2 max-w-3xl mx-auto"
        style={{ overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {CATEGORIES.map((c) => (
          <div key={c.slug} className="relative shrink-0 flex items-center">
            <Link
              href={`/${locale}/category/${c.slug}`}
              className="px-3 py-1.5 text-sm rounded-l-full whitespace-nowrap font-bold"
              style={{ color: '#141414', background: '#F7F7F5' }}
            >
              {c.en}
            </Link>
            <button
              onClick={() => setCatOpen(catOpen === c.slug ? null : c.slug)}
              className="pl-1 pr-2.5 py-1.5 flex items-center rounded-r-full"
              style={{ background: '#F7F7F5' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4L6 8L10 4" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {catOpen === c.slug && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(null)} />
                <div
                  className="absolute top-[calc(100%+4px)] right-0 z-20 rounded-lg overflow-hidden shadow-lg border border-gray-100"
                  style={{ width: 100, background: '#fff' }}
                >
                  <Link
                    href={`/bn/category/${c.slug}`}
                    onClick={() => setCatOpen(null)}
                    className="block px-3 py-2 text-[12px] font-bold"
                    style={{ color: '#141414', borderBottom: '1px solid #F0F0EE' }}
                  >
                    বাংলা
                  </Link>
                  <Link
                    href={`/en/category/${c.slug}`}
                    onClick={() => setCatOpen(null)}
                    className="block px-3 py-2 text-[12px] font-bold"
                    style={{ color: '#9A9A9A' }}
                  >
                    English
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
