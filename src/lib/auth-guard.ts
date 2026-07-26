import { useAuthStore } from "@/stores/auth-store";

/** Redirect guests to login; returns false when not authenticated. */
export function requireLogin(redirectTo?: string): boolean {
  const { hasHydrated, isAuthenticated } = useAuthStore.getState();

  if (isAuthenticated) {
    return true;
  }

  // Do not redirect while persisted auth is still being restored.
  if (!hasHydrated || typeof window === "undefined") {
    return false;
  }

  const target =
    redirectTo ||
    `${window.location.pathname}${window.location.search}` ||
    "/";
  const params = new URLSearchParams({ redirect: target });
  window.location.assign(`/login?${params.toString()}`);
  return false;
}
