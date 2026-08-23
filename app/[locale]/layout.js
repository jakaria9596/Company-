import { Fraunces, Inter, Noto_Sans_Bengali, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDictionary } from '../../lib/dictionary';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '600', '900'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const notoBengali = Noto_Sans_Bengali({ subsets: ['bengali'], weight: ['400', '500', '600', '700'], variable: '--font-noto-bengali', display: 'swap' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

const SITE_URL = 'https://bizkotha.com';

export function generateStaticParams() {
  return [{ locale: 'bn' }, { locale: 'en' }];
}

export async function generateMetadata({ params: { locale } }) {
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.siteName, template: `%s | ${dict.siteName}` },
    description: dict.tagline,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { bn: `${SITE_URL}/bn`, en: `${SITE_URL}/en` },
    },
    verification: {
      google: 'RCm0YOEOyUQ-tTjLuWvEU5OMg7tqgSircJndVO95GIM',
    },
  };
}

export default function LocaleLayout({ children, params: { locale } }) {
  const dict = getDictionary(locale);
  const fontClass = locale === 'bn'
    ? `${notoBengali.variable} font-body-bn`
    : `${fraunces.variable} ${inter.variable} font-body-en`;

  return (
    <html lang={locale}>
      <body className={`${fontClass} ${plexMono.variable} bg-white min-h-screen flex flex-col`}>
        <Header locale={locale} dict={dict} />
        <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-6">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
