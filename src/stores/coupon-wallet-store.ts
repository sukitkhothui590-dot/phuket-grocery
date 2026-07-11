import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClaimableCoupon, SavedCoupon } from "@/types";
import {
  getClaimableCoupons,
  isCouponExpired,
} from "@/lib/coupons/catalog";

interface CouponWalletState {
  /** userId -> saved coupons */
  byUser: Record<string, SavedCoupon[]>;

  getSaved: (userId: string) => SavedCoupon[];
  getUsable: (userId: string) => SavedCoupon[];
  hasClaimed: (userId: string, code: string) => boolean;
  claim: (
    userId: string,
    coupon: ClaimableCoupon,
  ) => { success: boolean; error?: string };
  markUsed: (userId: string, code: string) => void;
  remove: (userId: string, code: string) => void;
}

export const useCouponWalletStore = create<CouponWalletState>()(
  persist(
    (set, get) => ({
      byUser: {},

      getSaved: (userId) => get().byUser[userId] ?? [],

      getUsable: (userId) =>
        (get().byUser[userId] ?? []).filter(
          (coupon) =>
            coupon.isActive &&
            !coupon.usedAt &&
            !isCouponExpired(coupon.expiresAt),
        ),

      hasClaimed: (userId, code) => {
        const upper = code.toUpperCase();
        return (get().byUser[userId] ?? []).some(
          (coupon) => coupon.code.toUpperCase() === upper,
        );
      },

      claim: (userId, coupon) => {
        if (!userId) {
          return { success: false, error: "กรุณาเข้าสู่ระบบก่อนเก็บคูปอง" };
        }

        if (isCouponExpired(coupon.expiresAt)) {
          return { success: false, error: "คูปองนี้หมดอายุแล้ว" };
        }

        const existing = get().byUser[userId] ?? [];
        const already = existing.filter(
          (item) => item.code.toUpperCase() === coupon.code.toUpperCase(),
        );
        const limit = coupon.claimLimitPerUser ?? 1;
        if (already.length >= limit) {
          return { success: false, error: "คุณเก็บคูปองนี้ไว้แล้ว" };
        }

        const saved: SavedCoupon = {
          ...coupon,
          claimedAt: new Date().toISOString(),
        };

        set({
          byUser: {
            ...get().byUser,
            [userId]: [saved, ...existing],
          },
        });

        return { success: true };
      },

      markUsed: (userId, code) => {
        const upper = code.toUpperCase();
        set({
          byUser: {
            ...get().byUser,
            [userId]: (get().byUser[userId] ?? []).map((coupon) =>
              coupon.code.toUpperCase() === upper && !coupon.usedAt
                ? { ...coupon, usedAt: new Date().toISOString() }
                : coupon,
            ),
          },
        });
      },

      remove: (userId, code) => {
        const upper = code.toUpperCase();
        set({
          byUser: {
            ...get().byUser,
            [userId]: (get().byUser[userId] ?? []).filter(
              (coupon) => coupon.code.toUpperCase() !== upper,
            ),
          },
        });
      },
    }),
    { name: "phuket-grocery-coupon-wallet" },
  ),
);

export function listClaimableForUser(userId?: string | null) {
  const claimable = getClaimableCoupons();
  if (!userId) {
    return claimable.map((coupon) => ({
      coupon,
      claimed: false,
    }));
  }

  const wallet = useCouponWalletStore.getState();
  return claimable.map((coupon) => ({
    coupon,
    claimed: wallet.hasClaimed(userId, coupon.code),
  }));
}
