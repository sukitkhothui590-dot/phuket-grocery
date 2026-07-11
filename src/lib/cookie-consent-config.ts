import type { CookieConsentStatus, CookiePreferences } from "@/stores/cookie-consent-store";

export const COOKIE_CATEGORIES = [
  {
    id: "essential" as const,
    title: "คุกกี้ที่จำเป็น",
    description:
      "จำเป็นต่อการทำงานของเว็บไซต์ เช่น ตะกร้าสินค้า การเข้าสู่ระบบ และความปลอดภัย",
    required: true,
  },
  {
    id: "analytics" as const,
    title: "คุกกี้เพื่อการวิเคราะห์",
    description:
      "ช่วยให้เราเข้าใจพฤติกรรมการใช้งาน เพื่อปรับปรุงสินค้าและประสบการณ์บนเว็บไซต์",
    required: false,
  },
  {
    id: "marketing" as const,
    title: "คุกกี้เพื่อการตลาด",
    description:
      "ใช้แสดงโปรโมชั่นหรือเนื้อหาที่เกี่ยวข้องกับความสนใจของคุณ",
    required: false,
  },
] as const;

export function getPreferencesFromStatus(
  status: CookieConsentStatus
): CookiePreferences {
  if (status === "accepted") {
    return { analytics: true, marketing: true };
  }

  return { analytics: false, marketing: false };
}

export function getConsentChoiceLabel(status: CookieConsentStatus): string {
  switch (status) {
    case "accepted":
      return "ยอมรับคุกกี้ทั้งหมด";
    case "essential":
      return "ใช้เฉพาะคุกกี้ที่จำเป็น";
    default:
      return "ยังไม่ได้เลือก";
  }
}

export function formatConsentDate(isoDate: string | null): string | null {
  if (!isoDate) {
    return null;
  }

  return new Date(isoDate).toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function isCategoryEnabled(
  categoryId: (typeof COOKIE_CATEGORIES)[number]["id"],
  preferences: CookiePreferences
): boolean {
  if (categoryId === "essential") {
    return true;
  }

  return preferences[categoryId];
}
