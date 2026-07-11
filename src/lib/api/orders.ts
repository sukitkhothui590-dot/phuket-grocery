import { apiGet, apiPost } from "@/lib/api/client";
import { mapCoupon, mapOrder, type BackendOrder } from "@/lib/api/mappers";
import type { Coupon, Order, PaymentMethod, ShippingMethod } from "@/types";

export async function getOrders(token?: string | null): Promise<Order[]> {
  if (!token) {
    return [];
  }

  const response = await apiGet<BackendOrder[]>("/orders", { token });

  if (!response.success) {
    return [];
  }

  return response.data.map(mapOrder);
}

export async function getOrderById(
  id: string,
  token?: string | null,
): Promise<Order | null> {
  if (!token) {
    return null;
  }

  const response = await apiGet<BackendOrder>(`/orders/${id}`, { token });

  if (!response.success) {
    return null;
  }

  return mapOrder(response.data);
}

export async function getOrderByNumber(
  orderNumber: string,
  token?: string | null,
): Promise<Order | null> {
  const orders = await getOrders(token);
  return orders.find((order) => order.orderNumber === orderNumber) ?? null;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  items: Array<{ productId: string; unitId: string; quantity: number }>,
  token?: string | null,
): Promise<{ valid: boolean; coupon?: Coupon; discount?: number; error?: string }> {
  const response = await apiPost<{
    valid: boolean;
    reason?: string;
    discount?: number;
    subtotal?: number;
    coupon?: {
      id?: string;
      code: string;
      type?: string;
      value?: number;
      minPurchase?: number;
      maxDiscount?: number;
      endsAt?: string;
      isActive?: boolean;
    };
  }>(
    "/coupons/validate",
    {
      code,
      items,
    },
    { token },
  );

  if (!response.success) {
    return { valid: false, error: response.error.message };
  }

  if (!response.data.valid) {
    const reason = response.data.reason ?? "";
    const reasonMap: Record<string, string> = {
      NOT_FOUND: "ไม่พบโค้ดส่วนลดนี้",
      EXPIRED: "โค้ดส่วนลดหมดอายุแล้ว",
      INACTIVE: "โค้ดส่วนลดนี้ไม่สามารถใช้งานได้",
      MIN_PURCHASE: "ยอดสั่งซื้อยังไม่ถึงขั้นต่ำของโค้ดนี้",
      MIN_PURCHASE_NOT_MET: "ยอดสั่งซื้อยังไม่ถึงขั้นต่ำของโค้ดนี้",
      LIMIT_REACHED: "โค้ดส่วนลดถูกใช้ครบจำนวนแล้ว",
      PER_USER_LIMIT: "คุณใช้โค้ดนี้ครบจำนวนครั้งที่กำหนดแล้ว",
    };

    return {
      valid: false,
      error: reasonMap[reason] ?? "ไม่สามารถใช้โค้ดส่วนลดนี้ได้",
    };
  }

  const apiDiscount = response.data.discount ?? 0;
  const coupon = response.data.coupon
    ? mapCoupon(response.data.coupon)
    : {
        id: code,
        code,
        discountType: "fixed" as const,
        discountValue: apiDiscount,
        usageLimit: 9999,
        usedCount: 0,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        isActive: true,
      };

  return {
    valid: true,
    coupon,
    discount: apiDiscount,
  };
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

export interface CheckoutPayload {
  paymentMethod: PaymentMethod;
  shippingMethod?: ShippingMethod;
  paymentSlipUrl?: string;
  paymentBank?: string;
  paymentAmount?: number;
  transferredAt?: string;
  transferDate?: string;
  transferTime?: string;
  addressId?: string;
  recipientName?: string;
  phone?: string;
  addressLine?: string;
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  note?: string;
  couponCode?: string;
}

export async function checkout(
  token: string,
  payload: CheckoutPayload,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const body: Record<string, unknown> = {
    paymentMethod: payload.paymentMethod,
    shippingMethod: payload.shippingMethod,
    note: payload.note,
    couponCode: payload.couponCode,
  };

  if (payload.paymentMethod === "bank_transfer") {
    if (payload.paymentSlipUrl) body.paymentSlipUrl = payload.paymentSlipUrl;
    if (payload.paymentBank) body.paymentBank = payload.paymentBank;
    if (payload.paymentAmount != null) body.paymentAmount = payload.paymentAmount;
    if (payload.transferredAt) body.transferredAt = payload.transferredAt;
    if (payload.transferDate) body.transferDate = payload.transferDate;
    if (payload.transferTime) body.transferTime = payload.transferTime;
  }

  if (payload.addressId) {
    body.addressId = payload.addressId;
  } else {
    body.recipientName = payload.recipientName;
    body.phone = payload.phone;
    body.addressLine = payload.addressLine;
    body.subDistrict = payload.subDistrict;
    body.district = payload.district;
    body.province = payload.province;
    body.postalCode = payload.postalCode;
  }

  const response = await apiPost<BackendOrder>("/orders/checkout", body, {
    token,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถสร้างคำสั่งซื้อได้",
    };
  }

  return {
    success: true,
    order: mapOrder(response.data),
  };
}

export async function uploadOrderSlip(
  token: string,
  orderId: string,
  payload: {
    paymentSlipUrl: string;
    paymentBank?: string;
    paymentAmount?: number;
    transferredAt?: string;
    transferDate?: string;
    transferTime?: string;
  },
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const response = await apiPost<BackendOrder>(
    `/orders/${orderId}/slip`,
    payload,
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถอัปโหลดสลิปได้",
    };
  }

  return {
    success: true,
    order: mapOrder(response.data),
  };
}

export async function cancelOrder(
  token: string,
  orderId: string,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  const response = await apiPost<BackendOrder>(
    `/orders/${orderId}/cancel`,
    {},
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถยกเลิกคำสั่งซื้อได้",
    };
  }

  return {
    success: true,
    order: mapOrder(response.data),
  };
}
