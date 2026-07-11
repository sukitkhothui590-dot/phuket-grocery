"use client";

import Link from "next/link";
import { Check, Cookie, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  COOKIE_CATEGORIES,
  formatConsentDate,
  getConsentChoiceLabel,
  isCategoryEnabled,
} from "@/lib/cookie-consent-config";
import { useCookieConsentHydrated } from "@/hooks/use-cookie-consent-hydrated";
import { useCookieConsentStore } from "@/stores/cookie-consent-store";

export function CookieSettingsDialog() {
  const hydrated = useCookieConsentHydrated();
  const status = useCookieConsentStore((state) => state.status);
  const acceptedAt = useCookieConsentStore((state) => state.acceptedAt);
  const preferences = useCookieConsentStore((state) => state.preferences);
  const settingsOpen = useCookieConsentStore((state) => state.settingsOpen);
  const setSettingsOpen = useCookieConsentStore((state) => state.setSettingsOpen);
  const acceptAll = useCookieConsentStore((state) => state.acceptAll);
  const acceptEssentialOnly = useCookieConsentStore(
    (state) => state.acceptEssentialOnly
  );

  if (!hydrated) {
    return null;
  }

  const hasConsent = status !== "pending";
  const formattedDate = formatConsentDate(acceptedAt);

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-lg p-0 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:max-w-[520px]"
      >
        <div className="bg-primary px-5 py-4 text-white sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Cookie className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white sm:text-lg">
                  การตั้งค่าคุกกี้
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-white/80">
                  ตรวจสอบและจัดการความยินยอมในการใช้คุกกี้
                </DialogDescription>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="rounded-md p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="ปิด"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 bg-white px-5 py-5 sm:px-6">
          {hasConsent ? (
            <div className="rounded-lg border border-primary/15 bg-secondary px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                สิ่งที่คุณยืนยันไว้
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                {getConsentChoiceLabel(status)}
              </p>
              {formattedDate && (
                <p className="mt-1 text-sm text-muted-foreground">
                  ยืนยันเมื่อ {formattedDate}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              คุณยังไม่ได้เลือกความยินยอม กรุณาเลือกตัวเลือกด้านล่าง
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">
              ประเภทคุกกี้
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {COOKIE_CATEGORIES.map((category, index) => {
                const enabled = isCategoryEnabled(category.id, preferences);

                return (
                  <div
                    key={category.id}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      index > 0 ? "border-t border-slate-200" : ""
                    }`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
                      {category.required ? (
                        <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Cookie className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {category.title}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            enabled
                              ? "bg-primary/10 text-primary"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {enabled ? (
                            <>
                              <Check className="h-3 w-3" />
                              เปิด
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3" />
                              ปิด
                            </>
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {category.description}
                      </p>
                      {category.required && (
                        <p className="mt-1 text-[11px] text-primary">
                          จำเป็นต่อการใช้งาน ไม่สามารถปิดได้
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            อ่านเพิ่มเติมได้ที่{" "}
            <Link
              href="/privacy"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => setSettingsOpen(false)}
            >
              นโยบายความเป็นส่วนตัว
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={acceptEssentialOnly}
            className="rounded border border-primary/60 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            ใช้เฉพาะที่จำเป็น
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/80"
          >
            ยอมรับทั้งหมด
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
