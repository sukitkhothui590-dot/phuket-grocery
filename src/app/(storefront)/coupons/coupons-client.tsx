"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { getAvailableCoupons } from "@/lib/api/coupons";
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

  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = COUPON_CATEGORIES.find((c) => c.id === activeType);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    const result = await getAvailableCoupons({
      category: activeType,
    });
    setCoupons(result.coupons);
    setLoading(false);
  }, [activeType]);

  useEffect(() => {
    void loadCoupons();
  }, [loadCoupons]);

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
              {activeCategory?.title ?? "คูปองส่วนลด"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeCategory?.description ??
                "คูปองจากร้านจะแสดงให้อัตโนมัติ เลือกใช้ได้ทันทีตอนชำระเงิน"}
            </p>
          </div>
        </div>

        <Link
          href="/cart"
          className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
        >
          ไปใช้ในตะกร้า →
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
          {coupons.map((coupon) => (
            <CouponVoucherCard
              key={coupon.id}
              coupon={coupon}
              detailed
              actionLabel="ใช้ที่ตะกร้า"
              onAction={() => router.push("/cart")}
            />
          ))}
        </div>
      )}
    </main>
  );
}
