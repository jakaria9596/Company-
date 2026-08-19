'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function TrendingCarousel({ articles, locale, label }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    const step = () => {
      if (!paused && el) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  if (!articles?.length) return null;

  const loop = [...articles, ...articles];

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-[13px] font-bold text-ink">{label}</h2>
      </div>
      <div
        ref={trackRef}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="flex gap-3 overflow-x-auto px-4 pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {loop.map((a, i) => (
          <Link
            key={i}
            href={`/${locale}/blog/${a.slug}`}
            className="relative shrink-0 w-64 h-36 rounded-2xl overflow-hidden flex items-end p-3 bg-cardbg"
          >
            {a.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.image} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <p className="relative text-white font-semibold text-sm leading-snug line-clamp-2">
              {a.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
              }
