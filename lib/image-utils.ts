// Used to validate image URLs before rendering so unknown hosts show a fallback instead of crashing
const ALLOWED_IMAGE_HOSTS = [
  "m.media-amazon.com",
  "images-na.ssl-images-amazon.com",
];

export function isAllowedImageUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_IMAGE_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}
