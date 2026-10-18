// Widths the /img route accepts (keeps the edge cache from fragmenting).
export const IMAGE_WIDTHS = [320, 480, 640, 960, 1280];

export function imgSrc(image, width) {
  if (!image) return '';
  return image.startsWith('/img/') ? `${image}&w=${width}` : image;
}

export function imgSrcSet(image, widths) {
  if (!image || !image.startsWith('/img/')) return undefined;
  return widths.map((w) => `${image}&w=${w} ${w}w`).join(', ');
}
