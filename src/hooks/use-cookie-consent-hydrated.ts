"use client";

import { useEffect, useState } from "react";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export function useCookieConsentHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finishHydration = () => setHydrated(true);

    if (useCookieConsentStore.persist.hasHydrated()) {
      finishHydration();
    }

    return useCookieConsentStore.persist.onFinishHydration(finishHydration);
  }, []);

  return hydrated;
}
