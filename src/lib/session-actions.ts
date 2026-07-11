import { syncUserAddresses } from "@/lib/address-actions";
import { syncLocalCartToServer } from "@/lib/cart-actions";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types";

export async function initializeUserSession(
  user: User,
  tokens: { accessToken: string; refreshToken: string },
): Promise<void> {
  useAuthStore.getState().setAuth(user, tokens);
  await Promise.all([syncLocalCartToServer(), syncUserAddresses()]);
}
