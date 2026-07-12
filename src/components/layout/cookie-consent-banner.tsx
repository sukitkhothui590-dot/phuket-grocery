"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useCookieConsentHydrated } from "@/hooks/use-cookie-consent-hydrated";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export function CookieConsentBanner() {
  const hydrated = useCookieConsentHydrated();
  const status = useCookieConsentStore((state) => state.status);
  const acceptAll = useCookieConsentStore((state) => state.acceptAll);
  const acceptEssentialOnly = useCookieConsentStore(
    (state) => state.acceptEssentialOnly
  );
  const setSettingsOpen = useCookieConsentStore((state) => state.setSettingsOpen);

  if (!hydrated || status !== "pending") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="การแจ้งเตือนการใช้คุกกี้"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/20 bg-white shadow-[0_-10px_40px_rgba(26,43,44,0.1)] print:hidden"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:gap-6 lg:py-5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-primary">
            <Cookie className="h-5 w-5" strokeWidth={1.5} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground sm:text-base">
              เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ
            </h2>
            <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
              เว็บไซต์ใช้คุกกี้ที่จำเป็นและคุกกี้เพื่อวิเคราะห์การใช้งาน
              เพื่อพัฒนาบริการให้ดียิ่งขึ้น{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                อ่านนโยบายความเป็นส่วนตัว
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:shrink-0">
          <button
            type="button"
            onClick={acceptAll}
            className="rounded bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/80"
          >
            ยอมรับทั้งหมด
          </button>
          <button
            type="button"
            onClick={acceptEssentialOnly}
            className="rounded border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            ใช้เฉพาะที่จำเป็น
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
          >
            ดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  );
}
