export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    const proxyTarget = process.env.API_PROXY_TARGET;
    if (proxyTarget) {
      return `${proxyTarget.replace(/\/$/, "")}/backend`;
    }
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend";
}
