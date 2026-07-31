import Link from 'next/link';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header({ locale, dict }) {
  return (
    <header className="border-b-2 border-ink/80">
      <div className="max-w-3xl mx-auto px-5 py-6 flex items-center justify-between">
        <Link href={`/${locale}`} className="group">
          <div className="font-display-en font-black text-2xl md:text-3xl tracking-tight text-ink group-hover:text-navy transition-colors">
            {dict.siteName}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-brass mt-1">
            {dict.tagline}
          </div>
        </Link>
        <LocaleSwitcher locale={locale} dict={dict} />
      </div>
      <nav className="max-w-3xl mx-auto px-5 pb-4 flex gap-6 font-mono text-xs uppercase tracking-wider text-ink-soft">
        <Link href={`/${locale}`} className="hover:text-navy">{dict.nav.home}</Link>
        <Link href={`/${locale}/blog`} className="hover:text-navy">{dict.nav.blog}</Link>
        <Link href={`/${locale}/about`} className="hover:text-navy">{dict.nav.about}</Link>
      </nav>
    </header>
  );
}
