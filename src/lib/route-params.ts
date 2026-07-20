/**
 * Next.js may leave non-ASCII dynamic path segments percent-encoded in
 * `params` (e.g. "%E0%B9%80..." instead of "เครื่องดื่ม"). Decode safely
 * before comparing to API/DB slugs or building further URLs.
 */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value).normalize("NFC");
  } catch {
    return value.normalize("NFC");
  }
}
