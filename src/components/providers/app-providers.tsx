"use client";

import { useEffect } from "react";
import { syncUserAddresses } from "@/lib/address-actions";
import { loadCartFromServer } from "@/lib/cart-actions";
import { useAuthStore } from "@/stores/auth-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && isAuthenticated && accessToken) {
      void Promise.all([loadCartFromServer(), syncUserAddresses()]);
    }
  }, [hasHydrated, isAuthenticated, accessToken]);

  return children;
}
