import type { ClaimableCoupon, CouponCategory } from "@/types";

/**
 * Claimable voucher catalog aligned with live backend coupon codes.
 * Until backend exposes GET /coupons/available + claim APIs,
 * the storefront uses this list for the "เก็บคูปอง" experience.
 */
export const CLAIMABLE_COUPON_CATALOG: ClaimableCoupon[] = [
  {
    id: "freeship",
    code: "FREESHIP",
    title: "ช่วยค่าส่ง ฿60",
    description: "ลดค่าจัดส่ง ฿60 เมื่อยอดสั่งซื้อครบ ฿400",
    category: "shipping",
    appliesTo: "ค่าจัดส่งทุกรายการในร้าน (มาตรฐาน / ด่วน)",
    startsAt: "2026-07-01T00:00:00.000Z",
    badge: "ส่งฟรี",
    discountType: "fixed",
    discountValue: 60,
    minPurchase: 400,
    usageLimit: 1000,
    usedCount: 0,
    expiresAt: "2027-07-09T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "welcome",
    code: "WELCOME",
    title: "ยินดีต้อนรับ",
    description: "ลด 5% ทุกออเดอร์ ไม่มีขั้นต่ำ",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
    startsAt: "2026-07-01T00:00:00.000Z",
    badge: "ทุกออเดอร์",
    discountType: "percentage",
    discountValue: 5,
    minPurchase: 0,
    usageLimit: 10000,
    usedCount: 0,
    expiresAt: "2027-07-09T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "newuser",
    code: "NEWUSER",
    title: "สมาชิกใหม่",
    description: "ลด 15% สูงสุด ฿200 เมื่อซื้อครบ ฿300",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · สำหรับสมาชิกใหม่",
    startsAt: "2026-07-01T00:00:00.000Z",
    badge: "แนะนำ",
    discountType: "percentage",
    discountValue: 15,
    minPurchase: 300,
    maxDiscount: 200,
    usageLimit: 500,
    usedCount: 0,
    expiresAt: "2027-01-05T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "save100",
    code: "SAVE100",
    title: "ลดทันที ฿100",
    description: "ลด ฿100 เมื่อซื้อครบ ฿500",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
    startsAt: "2026-07-01T00:00:00.000Z",
    badge: "ทุกออเดอร์",
    discountType: "fixed",
    discountValue: 100,
    minPurchase: 500,
    usageLimit: 200,
    usedCount: 0,
    expiresAt: "2027-01-05T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "phuket20",
    code: "PHUKET20",
    title: "ภูเก็ตพิเศษ",
    description: "ลด 20% สูงสุด ฿500 เมื่อซื้อครบ ฿1,000",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
    startsAt: "2026-07-01T00:00:00.000Z",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 1000,
    maxDiscount: 500,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: "2026-10-07T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 2,
  },
  {
    id: "summer25",
    code: "SUMMER25",
    title: "ซัมเมอร์ฮอตดีล",
    description: "ลด 25% สูงสุด ฿300 เมื่อซื้อครบ ฿800",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ช่วงโปรซัมเมอร์",
    startsAt: "2026-06-01T00:00:00.000Z",
    badge: "จำกัดเวลา",
    discountType: "percentage",
    discountValue: 25,
    minPurchase: 800,
    maxDiscount: 300,
    usageLimit: 150,
    usedCount: 0,
    expiresAt: "2026-11-06T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "vip500",
    code: "VIP500",
    title: "VIP ลดใหญ่",
    description: "ลด ฿500 เมื่อซื้อครบ ฿3,000",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ออเดอร์ยอดสูง",
    startsAt: "2026-07-01T00:00:00.000Z",
    discountType: "fixed",
    discountValue: 500,
    minPurchase: 3000,
    usageLimit: 50,
    usedCount: 0,
    expiresAt: "2027-01-05T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 1,
  },
  {
    id: "test50",
    code: "TEST50",
    title: "ทดลองใช้",
    description: "ลด ฿50 เมื่อซื้อครบ ฿100",
    category: "order_discount",
    appliesTo: "ทุกสินค้าในร้าน · ใช้ได้ทุกคำสั่งซื้อ",
    startsAt: "2026-07-01T00:00:00.000Z",
    badge: "ทุกออเดอร์",
    discountType: "fixed",
    discountValue: 50,
    minPurchase: 100,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
    claimLimitPerUser: 5,
  },
];

export const COUPON_CATEGORIES: Array<{
  id: CouponCategory;
  title: string;
  subtitle: string;
  description: string;
}> = [
  {
    id: "shipping",
    title: "โค้ดส่งฟรี",
    subtitle: "ลด / ช่วยค่าจัดส่ง",
    description: "คูปองช่วยค่าส่ง ใช้ตอนชำระเงินเมื่อยอดถึงขั้นต่ำ",
  },
  {
    id: "order_discount",
    title: "โค้ดลดทุกการสั่งซื้อ",
    subtitle: "ส่วนลดท้ายบิล",
    description: "คูปองลดราคาสินค้า ใช้ได้กับคำสั่งซื้อในร้าน",
  },
];

export function formatCouponBenefit(coupon: {
  discountType: "fixed" | "percentage";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
}): string {
  const discountText =
    coupon.discountType === "fixed"
      ? `ลด ฿${coupon.discountValue.toLocaleString()}`
      : `ลด ${coupon.discountValue}%${
          coupon.maxDiscount
            ? ` สูงสุด ฿${coupon.maxDiscount.toLocaleString()}`
            : ""
        }`;

  if (coupon.minPurchase && coupon.minPurchase > 0) {
    return `${discountText} เมื่อซื้อครบ ฿${coupon.minPurchase.toLocaleString()}`;
  }

  return discountText;
}

export function formatCouponDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isCouponExpired(expiresAt: string, now = new Date()): boolean {
  return new Date(expiresAt).getTime() < now.getTime();
}

export function getDailyHighlightCodes(now = new Date()): Set<string> {
  const day = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86_400_000,
  );
  const active = CLAIMABLE_COUPON_CATALOG.filter(
    (coupon) => coupon.isActive && !isCouponExpired(coupon.expiresAt, now),
  );
  if (active.length === 0) return new Set();

  const picks = new Set<string>();
  for (let i = 0; i < Math.min(4, active.length); i += 1) {
    picks.add(active[(day + i) % active.length].code);
  }
  return picks;
}

export function getClaimableCoupons(
  category?: CouponCategory,
  now = new Date(),
): ClaimableCoupon[] {
  const daily = getDailyHighlightCodes(now);

  return CLAIMABLE_COUPON_CATALOG.filter(
    (coupon) =>
      coupon.isActive &&
      !isCouponExpired(coupon.expiresAt, now) &&
      (!category || coupon.category === category),
  ).map((coupon) => ({
    ...coupon,
    badge: daily.has(coupon.code) ? coupon.badge ?? "คูปองวันนี้" : coupon.badge,
  }));
}

export function getCouponCategoryCounts(now = new Date()) {
  const active = getClaimableCoupons(undefined, now);
  return {
    shipping: active.filter((c) => c.category === "shipping").length,
    order_discount: active.filter((c) => c.category === "order_discount").length,
  };
}
