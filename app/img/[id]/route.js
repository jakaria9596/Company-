export const runtime = 'edge';

import { getPublishedImageUrl } from '../../../lib/notion';
import { IMAGE_WIDTHS } from '../../../lib/image';

const ID_RE = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

function snapWidth(raw) {
  const n = parseInt(raw, 10);
  if (!n) return 640;
  return IMAGE_WIDTHS.find((w) => w >= n) || IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
}

export async function GET(request, { params }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return new Response('Not found', { status: 404 });

  const url = new URL(request.url);
  const width = snapWidth(url.searchParams.get('w'));
  const version = (url.searchParams.get('v') || '0').replace(/\D/g, '');
  const webp = /image\/webp/.test(request.headers.get('accept') || '');

  let store = null;
  try {
    store = typeof caches !== 'undefined' ? caches.default : null;
  } catch (e) {}
  const cacheKey = new Request(`${url.origin}/img/${id}?v=${version}&w=${width}&f=${webp ? 'webp' : 'orig'}`);

  if (store) {
    try {
      const hit = await store.match(cacheKey);
      if (hit) return hit;
    } catch (e) {}
  }

  let source;
  try {
    source = await getPublishedImageUrl(id);
  } catch (e) {
    return new Response('Upstream error', { status: 502 });
  }
  if (!source) return new Response('Not found', { status: 404 });

  // Ask Cloudflare to resize/convert; if Image Resizing isn't enabled, fall back to the original file.
  let upstream = null;
  try {
    upstream = await fetch(source, {
      cf: { image: { width, quality: 75, ...(webp ? { format: 'webp' } : {}) } },
    });
  } catch (e) {}
  if (!upstream || !upstream.ok) {
    try {
      upstream = await fetch(source);
    } catch (e) {}
  }
  if (!upstream || !upstream.ok) return new Response('Upstream error', { status: 502 });

  const response = new Response(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      Vary: 'Accept',
    },
  });

  if (store) {
    try {
      await store.put(cacheKey, response.clone());
    } catch (e) {}
  }
  return response;
}
