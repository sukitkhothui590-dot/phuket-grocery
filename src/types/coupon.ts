export type CouponCategory = "shipping" | "order_discount";

export type UserCouponStatus = "AVAILABLE" | "USED" | "EXPIRED" | "REVOKED";

export interface Coupon {
  id: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  title?: string;
  description?: string;
}

/** Coupon available for users to claim (Shopee-style) */
export interface ClaimableCoupon extends Coupon {
  title: string;
  description: string;
  category: CouponCategory;
  startsAt?: string;
  appliesTo: string;
  badge?: string;
  claimLimitPerUser?: number;
  claimedByMe?: boolean;
  claimedCountByMe?: number;
  remainingClaims?: number;
  isClaimable?: boolean;
  sortOrder?: number;
}

/** Coupon already saved in the user's wallet */
export interface SavedCoupon extends ClaimableCoupon {
  couponId?: string;
  claimedAt: string;
  usedAt?: string;
  orderId?: string;
  status?: UserCouponStatus;
}

export interface CouponCategoryInfo {
  id: CouponCategory;
  title: string;
  subtitle: string;
  href: string;
}
