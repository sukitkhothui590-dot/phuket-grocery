"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { useAuthStore } from "@/stores/auth-store";
import {
  claimCoupon,
  getAvailableCoupons,
} from "@/lib/api/coupons";
import { COUPON_CATEGORIES } from "@/lib/coupons/catalog";
import type { ClaimableCoupon, CouponCategory } from "@/types";

function isCouponCategory(value: string | null): value is CouponCategory {
  return value === "shipping" || value === "order_discount";
}

export default function CouponsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const activeType = isCouponCategory(typeParam) ? typeParam : undefined;

  const { accessToken, isAuthenticated } = useAuthStore();
  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCategory = COUPON_CATEGORIES.find((c) => c.id === activeType);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAvailableCoupons({
      category: activeType,
      token: accessToken,
    });
    setCoupons(result.coupons);
    setLoading(false);
  }, [accessToken, activeType]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

  const handleClaim = async (coupon: ClaimableCoupon) => {
    setMessage(null);
    setError(null);

    if (!isAuthenticated || !accessToken) {
      const next = activeType
        ? `/login?next=${encodeURIComponent(`/coupons?type=${activeType}`)}`
        : "/login?next=/coupons";
      router.push(next);
      return;
    }

    setClaimingId(coupon.id);
    const result = await claimCoupon(coupon.id, accessToken);
    setClaimingId(null);

    if (!result.success) {
      setError(result.error ?? "เก็บคูปองไม่สำเร็จ");
      return;
    }

    setMessage(`เก็บคูปอง ${coupon.code} แล้ว`);
    await loadCoupons();
  };

  const filters: Array<{ id?: CouponCategory; label: string; href: string }> = [
    { label: "ทั้งหมด", href: "/coupons" },
    ...COUPON_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.title,
      href: `/coupons?type=${category.id}`,
    })),
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50">
            <TicketPercent className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {activeCategory?.title ?? "เก็บคูปองส่วนลด"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeCategory?.description ??
                "เลือกคูปองที่ต้องการ ดูเงื่อนไขแล้วกดเก็บไว้ใช้ตอนชำระเงิน"}
            </p>
          </div>
        </div>

        <Link
          href="/account/coupons"
          className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
        >
          คูปองของฉัน →
        </Link>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
        {filters.map((filter) => {
          const active = filter.id ? activeType === filter.id : !activeType;
          return (
            <Link
              key={filter.href}
              href={filter.href}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {message}{" "}
          <Link href="/account/coupons" className="font-semibold underline">
            เปิดดู
          </Link>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-14 text-center text-sm text-muted-foreground">
          กำลังโหลดคูปอง...
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-14 text-center text-sm text-muted-foreground">
          ยังไม่มีคูปองในหมวดนี้
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => {
            const claimed =
              coupon.claimedByMe || (coupon.remainingClaims ?? 1) <= 0;
            return (
              <CouponVoucherCard
                key={coupon.id}
                coupon={coupon}
                claimed={claimed}
                disabled={claimingId !== null}
                detailed
                actionLabel={
                  claimingId === coupon.id ? "กำลังเก็บ..." : "เก็บคูปอง"
                }
                onAction={() => void handleClaim(coupon)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
