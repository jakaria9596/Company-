import Link from 'next/link';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale, dict }) {
  return (
    <header className="sticky top-0 bg-white z-20 border-b border-line">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-display-en text-lg font-black text-ink">
          {dict.siteName}<span className="text-accent">.</span>
        </Link>
        <LocaleSwitcher locale={locale} dict={dict} />
      </div>
      <nav className="max-w-3xl mx-auto px-4 flex gap-5 overflow-x-auto pb-2 text-sm">
        <Link href={`/${locale}`} className="shrink-0 pb-1 font-semibold text-ink border-b-2 border-accent">
          {dict.nav.home}
        </Link>
        <Link href={`/${locale}/blog`} className="shrink-0 pb-1 text-ink-soft border-b-2 border-transparent">
          {dict.nav.blog}
        </Link>
        <Link href={`/${locale}/about`} className="shrink-0 pb-1 text-ink-soft border-b-2 border-transparent">
          {dict.nav.about}
        </Link>
      </nav>
    </header>
  );
}
