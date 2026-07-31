'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LocaleSwitcher({ locale, dict }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const nextLocale = locale === 'bn' ? 'en' : 'bn';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const nextPath = segments.join('/');

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(nextPath);
  }

  return (
    <button onClick={switchLocale} className="stamp" aria-label="Switch language">
      {dict.switchLang}
    </button>
  );
}
