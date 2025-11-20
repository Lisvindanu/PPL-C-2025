const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getApiOrigin() {
  try {
    const url = new URL(API_BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }
}

export function buildMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const origin = getApiOrigin();
  const normalized = String(path).replace(/^\/+/, "");

  const rel = normalized.startsWith("public/")
    ? normalized
    : `public/${normalized}`;

  return `${origin}/${rel}`;
}
