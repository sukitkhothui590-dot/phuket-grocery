import { logout as logoutApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export async function signOut() {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (refreshToken) {
    try {
      await logoutApi(refreshToken);
    } catch {
      // Clear local session even if the API call fails.
    }
  }

  useAuthStore.getState().logout();
}
