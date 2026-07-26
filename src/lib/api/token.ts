import { getApiBaseUrl } from "@/lib/api/config";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";

let refreshPromise: Promise<string | null> | null = null;

export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      return null;
    }

    const base = getApiBaseUrl().replace(/\/$/, "");
    const target = `${base}/auth/refresh`;
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.API_PROXY_TARGET ?? "http://localhost:3000";
    const url =
      target.startsWith("http://") || target.startsWith("https://")
        ? target
        : new URL(target, origin).toString();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const payload = await response.json();

      const tokens = payload?.data?.tokens ?? payload?.data;
      const accessToken = tokens?.accessToken as string | undefined;
      const nextRefreshToken = (tokens?.refreshToken ?? refreshToken) as string;

      if (
        (response.status === 401 || response.status === 403) &&
        (!payload?.success || !accessToken)
      ) {
        useAuthStore.getState().logout();
        useCartStore.getState().clearCart();
        return null;
      }

      // A temporary proxy/server failure must not destroy a valid local session.
      if (!response.ok || !payload?.success || !accessToken) {
        return null;
      }

      useAuthStore.getState().setTokens({
        accessToken,
        refreshToken: nextRefreshToken,
      });
      return accessToken;
    } catch {
      // Keep the session on network/JSON errors. A later request can retry.
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
