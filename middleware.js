import { NextResponse } from 'next/server';

const LOCALES = ['bn', 'en'];
// Bizkotha is written for readers in Bangladesh: Bengali is the default.
// Googlebot sends no Accept-Language header, so it must land on Bengali too.
const DEFAULT_LOCALE = 'bn';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return NextResponse.next();

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/img/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Only a language the reader explicitly picked (cookie) overrides the default.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale = LOCALES.includes(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  const res = NextResponse.redirect(url, cookieLocale ? 307 : 308);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/((?!_next|api|img/|.*\\..*).*)'],
};
