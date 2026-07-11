"use client";

import { Cookie } from "lucide-react";
import { useCookieConsentHydrated } from "@/hooks/use-cookie-consent-hydrated";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export function CookieConsentFab() {
  const hydrated = useCookieConsentHydrated();
  const status = useCookieConsentStore((state) => state.status);
  const setSettingsOpen = useCookieConsentStore((state) => state.setSettingsOpen);

  if (!hydrated || status === "pending") {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="ดูการตั้งค่าคุกกี้"
      title="ดูการตั้งค่าคุกกี้"
      onClick={() => setSettingsOpen(true)}
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-all hover:border-primary hover:text-primary sm:bottom-5 sm:left-5 sm:px-3.5 sm:py-2.5 sm:text-sm"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Cookie className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <span className="pr-1">คุกกี้</span>
    </button>
  );
}
