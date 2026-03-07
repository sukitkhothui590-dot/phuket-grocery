import { orders } from "@/lib/mock-data";
import { coupons } from "@/lib/mock-data";
import type { Order, Coupon } from "@/types";

export async function getOrders(userId?: string): Promise<Order[]> {
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  return orders.find((o) => o.id === id) ?? null;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  return orders.find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) return { valid: false, error: "ไม่พบโค้ดส่วนลดนี้" };
  if (!coupon.isActive)
    return { valid: false, error: "โค้ดส่วนลดนี้ไม่สามารถใช้งานได้" };
  if (new Date(coupon.expiresAt) < new Date())
    return { valid: false, error: "โค้ดส่วนลดหมดอายุแล้ว" };
  if (coupon.usedCount >= coupon.usageLimit)
    return { valid: false, error: "โค้ดส่วนลดถูกใช้ครบจำนวนแล้ว" };
  if (coupon.minPurchase && subtotal < coupon.minPurchase)
    return {
      valid: false,
      error: `ยอดสั่งซื้อขั้นต่ำ ${coupon.minPurchase.toLocaleString()} บาท`,
    };

  return { valid: true, coupon };
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.discountType === "fixed") {
    return coupon.discountValue;
  }
  const discount = (subtotal * coupon.discountValue) / 100;
  if (coupon.maxDiscount) {
    return Math.min(discount, coupon.maxDiscount);
  }
  return discount;
}
