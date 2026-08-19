import { Fraunces, Inter, Tiro_Bangla, Hind_Siliguri, IBM_Plex_Mono } from 'next/font/google';
import '../globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDictionary } from '../../lib/dictionary';
import { getAllArticles } from '../../lib/sheets';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '600', '900'], variable: '--font-fraunces', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const tiroBangla = Tiro_Bangla({ subsets: ['bengali'], weight: ['400'], variable: '--font-tiro-bangla', display: 'swap' });
const hindSiliguri = Hind_Siliguri({ subsets: ['bengali'], weight: ['400', '500', '600'], variable: '--font-hind-siliguri', display: 'swap' });
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

export default async function LocaleLayout({ children, params: { locale } }) {
  const dict = getDictionary(locale);
  const fontClass = locale === 'bn'
    ? `${tiroBangla.variable} ${hindSiliguri.variable} font-body-bn`
    : `${fraunces.variable} ${inter.variable} font-body-en`;

  let categories = [];
  try {
    const articles = await getAllArticles(locale);
    categories = [...new Set(articles.map((a) => a.category).filter((c) => c && c.length <= 25))];
  } catch (e) {}

  return (
    <html lang={locale}>
      <body className={`${fontClass} ${plexMono.variable} bg-white min-h-screen flex flex-col`}>
        <Header locale={locale} dict={dict} categories={categories} />
        <main className="flex-1 w-full max-w-3xl mx-auto px-5 py-6">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
