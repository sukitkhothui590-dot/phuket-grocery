"use client";

import { useCookieConsentHydrated } from "@/hooks/use-cookie-consent-hydrated";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export function CookieSettingsButton() {
  const hydrated = useCookieConsentHydrated();
  const setSettingsOpen = useCookieConsentStore((state) => state.setSettingsOpen);

  if (!hydrated) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setSettingsOpen(true)}
      className="text-white/80 transition-colors hover:text-white"
    >
      การตั้งค่าคุกกี้
    </button>
  );
}
