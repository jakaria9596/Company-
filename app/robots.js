const SITE_URL = 'https://www.yourdomain.com'; // TODO: বদলে দিন

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
