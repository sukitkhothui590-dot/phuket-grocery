import { apiGet, apiPost } from "@/lib/api/client";
import type {
  CartCoupon,
  ClaimableCoupon,
  CouponCategory,
  SavedCoupon,
  UserCouponStatus,
} from "@/types";

interface BackendCouponBase {
  id: string;
  code: string;
  title?: string | null;
  description?: string | null;
  category?: CouponCategory | null;
  appliesTo?: string | null;
  type?: "FIXED" | "PERCENT" | string;
  value?: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  badge?: string | null;
  claimLimitPerUser?: number | null;
  isClaimable?: boolean;
  claimedByMe?: boolean;
  claimedCountByMe?: number;
  remainingClaims?: number | null;
  sortOrder?: number | null;
  status?: UserCouponStatus;
  claimedAt?: string;
  usedAt?: string | null;
  orderId?: string | null;
  expiresAt?: string | null;
  couponId?: string;
  userId?: string;
  applicable?: boolean;
  discountPreview?: number;
  reason?: string | null;
  message?: string | null;
}

export async function getCouponsForCart(
  items: Array<{ productId: string; unitId: string; quantity: number }>,
  token?: string | null,
): Promise<{ subtotal: number; coupons: CartCoupon[] }> {
  const response = await apiPost<{
    subtotal: number;
    coupons: BackendCouponBase[];
  }>(
    "/coupons/for-cart",
    { items },
    { token },
  );

  if (!response.success) {
    return { subtotal: 0, coupons: [] };
  }

  return {
    subtotal: response.data.subtotal,
    coupons: response.data.coupons.map((coupon) => ({
      ...mapClaimableCoupon(coupon),
      applicable: coupon.applicable ?? false,
      discountPreview: coupon.discountPreview ?? 0,
      reason: coupon.reason ?? undefined,
      message: coupon.message ?? undefined,
    })),
  };
}

function mapDiscountType(type?: string): "fixed" | "percentage" {
  return type === "FIXED" || type === "fixed" ? "fixed" : "percentage";
}

function mapClaimableCoupon(data: BackendCouponBase): ClaimableCoupon {
  return {
    id: data.id,
    code: data.code,
    title: data.title ?? data.code,
    description: data.description ?? data.title ?? data.code,
    category: data.category === "shipping" ? "shipping" : "order_discount",
    appliesTo: data.appliesTo ?? "ทุกสินค้าในร้าน",
    discountType: mapDiscountType(data.type),
    discountValue: data.value ?? 0,
    minPurchase: data.minPurchase ?? undefined,
    maxDiscount: data.maxDiscount ?? undefined,
    usageLimit: 9999,
    usedCount: 0,
    startsAt: data.startsAt ?? undefined,
    expiresAt:
      data.endsAt ??
      data.expiresAt ??
      new Date(Date.now() + 86400000).toISOString(),
    isActive: true,
    badge: data.badge ?? undefined,
    claimLimitPerUser: data.claimLimitPerUser ?? undefined,
    claimedByMe: data.claimedByMe ?? false,
    claimedCountByMe: data.claimedCountByMe ?? 0,
    remainingClaims: data.remainingClaims ?? undefined,
    isClaimable: data.isClaimable ?? true,
    sortOrder: data.sortOrder ?? 0,
  };
}

function mapSavedCoupon(data: BackendCouponBase): SavedCoupon {
  const base = mapClaimableCoupon({
    ...data,
    id: data.id,
    endsAt: data.expiresAt ?? data.endsAt,
  });

  return {
    ...base,
    couponId: data.couponId ?? data.id,
    claimedAt: data.claimedAt ?? new Date().toISOString(),
    usedAt: data.usedAt ?? undefined,
    orderId: data.orderId ?? undefined,
    status: data.status ?? "AVAILABLE",
    expiresAt:
      data.expiresAt ??
      data.endsAt ??
      base.expiresAt,
  };
}

export async function getAvailableCoupons(params?: {
  category?: CouponCategory;
  token?: string | null;
  page?: number;
  limit?: number;
}): Promise<{
  coupons: ClaimableCoupon[];
  total: number;
  counts: { shipping: number; order_discount: number };
}> {
  const response = await apiGet<BackendCouponBase[]>("/coupons/available", {
    token: params?.token,
    searchParams: {
      category: params?.category,
      page: params?.page ?? 1,
      limit: params?.limit ?? 50,
    },
  });

  if (!response.success) {
    return {
      coupons: [],
      total: 0,
      counts: { shipping: 0, order_discount: 0 },
    };
  }

  const coupons = response.data.map(mapClaimableCoupon);
  return {
    coupons,
    total: response.meta?.total ?? coupons.length,
    counts: {
      shipping: coupons.filter((c) => c.category === "shipping").length,
      order_discount: coupons.filter((c) => c.category === "order_discount")
        .length,
    },
  };
}

export async function claimCoupon(
  couponId: string,
  token: string,
): Promise<{ success: boolean; coupon?: SavedCoupon; error?: string }> {
  const response = await apiPost<BackendCouponBase>(
    `/coupons/${couponId}/claim`,
    {},
    { token },
  );

  if (!response.success) {
    return { success: false, error: response.error.message };
  }

  return { success: true, coupon: mapSavedCoupon(response.data) };
}

export async function getMyCoupons(params: {
  token: string;
  status?: UserCouponStatus | "ALL";
  category?: CouponCategory;
  page?: number;
  limit?: number;
}): Promise<{
  coupons: SavedCoupon[];
  total: number;
  counts: { AVAILABLE: number; USED: number; EXPIRED: number };
}> {
  const response = await apiGet<BackendCouponBase[]>("/users/me/coupons", {
    token: params.token,
    searchParams: {
      status: params.status ?? "ALL",
      category: params.category,
      page: params.page ?? 1,
      limit: params.limit ?? 50,
    },
  });

  if (!response.success) {
    return {
      coupons: [],
      total: 0,
      counts: { AVAILABLE: 0, USED: 0, EXPIRED: 0 },
    };
  }

  const metaCounts = (
    response.meta as
      | {
          counts?: { AVAILABLE?: number; USED?: number; EXPIRED?: number };
        }
      | undefined
  )?.counts;

  return {
    coupons: response.data.map(mapSavedCoupon),
    total: response.meta?.total ?? response.data.length,
    counts: {
      AVAILABLE: metaCounts?.AVAILABLE ?? 0,
      USED: metaCounts?.USED ?? 0,
      EXPIRED: metaCounts?.EXPIRED ?? 0,
    },
  };
}
