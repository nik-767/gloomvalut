/** Base URL for Django media files served outside the API prefix. */
const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * Converts a backend media path into a full browser URL.
 * Use when rendering `image` fields from Django ImageField responses.
 */
export const resolveMediaUrl = (path, fallback = null) => {
  if (!path) {
    return fallback;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${MEDIA_BASE_URL}${normalizedPath}`;
};

/** Default castle image when the API returns no uploaded image. */
export const DEFAULT_CASTLE_IMAGE =
  'https://images.unsplash.com/photo-1599875953199-198967929424?auto=format&fit=crop&w=1200&q=80';
