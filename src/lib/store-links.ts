/** Map CMS banner/promo links that don't exist on the storefront to real routes. */
const LINK_ALIASES: Record<string, string> = {
  "/promotions": "/deals",
  "/promotions/end-of-month": "/deals",
  "/promotions/free-shipping": "/categories",
  "/products/new-arrivals": "/featured",
  "/products/eco-packaging": "/categories",
  "/promo": "/deals",
};

const SAFE_PREFIXES = [
  "/categories",
  "/products/",
  "/featured",
  "/deals",
  "/campaigns",
  "/blog",
  "/cart",
  "/checkout",
  "/contact",
  "/about",
  "/account",
];

/**
 * Resolve a CMS/internal link to a storefront path that won't 404.
 * External http(s) links are kept as-is.
 */
export function resolveStoreLink(link?: string | null, fallback = "/categories"): string {
  const raw = link?.trim();
  if (!raw) return fallback;

  if (/^https?:\/\//i.test(raw)) return raw;

  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const pathname = path.split("?")[0]?.split("#")[0] ?? path;

  if (LINK_ALIASES[pathname]) {
    const aliased = LINK_ALIASES[pathname];
    const query = path.includes("?") ? path.slice(path.indexOf("?")) : "";
    return `${aliased}${query}`;
  }

  if (
    pathname === "/" ||
    SAFE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix),
    )
  ) {
    return path;
  }

  return fallback;
}

export function isMediaUrl(value?: string | null): boolean {
  if (!value) return false;
  return (
    /^https?:\/\//i.test(value) ||
    value.startsWith("/") ||
    value.startsWith("data:")
  );
}
