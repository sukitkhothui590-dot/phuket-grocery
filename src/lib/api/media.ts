/**
 * Backend often stores media as path-only values (e.g. `/uploads/abc.jpg`)
 * served from the API host, not the storefront. Resolve those for <img src>.
 *
 * Static public assets (`/images/...`, `/promo/...`) stay same-origin.
 */

function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

/**
 * Host that serves `/uploads/*` (Nest ServeStatic, not under `/backend`).
 * Server: API_PROXY_TARGET. Client: NEXT_PUBLIC_MEDIA_BASE_URL when set.
 */
export function getMediaBaseUrl(): string {
  if (typeof window === "undefined") {
    const fromEnv =
      process.env.API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
      "";
    return trimSlash(fromEnv);
  }

  return trimSlash(process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "");
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:");
}

/** True when the path is backend-uploaded media (needs host or /uploads proxy). */
export function isBackendMediaPath(url: string) {
  return (
    url.startsWith("/uploads/") ||
    url.startsWith("uploads/") ||
    url === "/uploads"
  );
}

/**
 * Turn backend path-only media into a browser-loadable URL.
 * - absolute / data / blob → unchanged
 * - `/uploads/...` → `{mediaBase}/uploads/...` when base is known, else leave
 *   relative (Next rewrites `/uploads` → API host)
 * - other relative paths (storefront public/) → unchanged
 */
export function resolveMediaUrl(
  url: string | null | undefined,
): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (isAbsoluteUrl(trimmed)) return trimmed;

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (isBackendMediaPath(path)) {
    const base = getMediaBaseUrl();
    if (base) return `${base}${path}`;
    return path;
  }

  return path;
}

export function resolveMediaUrls(
  urls: Array<string | null | undefined> | null | undefined,
): string[] {
  if (!urls?.length) return [];
  return urls
    .map((url) => resolveMediaUrl(url))
    .filter((url) => url.length > 0);
}
