"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { useAuthStore } from "@/stores/auth-store";
import { getMyCoupons } from "@/lib/api/coupons";
import type { SavedCoupon } from "@/types";

export default function MyCouponsPage() {
  const router = useRouter();
  const { accessToken, isAuthenticated } = useAuthStore();
  const [coupons, setCoupons] = useState<SavedCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    AVAILABLE: 0,
    USED: 0,
    EXPIRED: 0,
  });

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    const result = await getMyCoupons({ token: accessToken, status: "ALL" });
    setCoupons(result.coupons);
    setCounts(result.counts);
    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?next=/account/coupons");
      return;
    }
    void load();
  }, [isAuthenticated, load, router]);

  const usable = coupons.filter((coupon) => coupon.status === "AVAILABLE");
  const usedOrExpired = coupons.filter(
    (coupon) => coupon.status === "USED" || coupon.status === "EXPIRED",
  );

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <TicketPercent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">คูปองของฉัน</h1>
            <p className="text-xs text-muted-foreground">
              พร้อมใช้ {counts.AVAILABLE} · ใช้แล้ว {counts.USED} · หมดอายุ{" "}
              {counts.EXPIRED}
            </p>
          </div>
        </div>
        <Link
          href="/coupons"
          className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
        >
          เก็บคูปองเพิ่ม →
        </Link>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-14 text-center text-sm text-muted-foreground">
          กำลังโหลดคูปอง...
        </div>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              พร้อมใช้ ({usable.length})
            </h2>
            {usable.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  ยังไม่มีคูปองพร้อมใช้
                </p>
                <Link
                  href="/coupons"
                  className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  ไปหน้าเก็บคูปอง
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {usable.map((coupon) => (
                  <CouponVoucherCard
                    key={coupon.id}
                    coupon={coupon}
                    detailed
                    secondaryLabel="พร้อมใช้ในตะกร้า"
                  />
                ))}
              </div>
            )}
            {usable.length > 0 && (
              <Link
                href="/cart"
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                ไปตะกร้าเพื่อใช้คูปอง →
              </Link>
            )}
          </section>

          {usedOrExpired.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                ใช้แล้ว / หมดอายุ ({usedOrExpired.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {usedOrExpired.map((coupon) => (
                  <CouponVoucherCard
                    key={coupon.id}
                    coupon={coupon}
                    disabled
                    secondaryLabel={
                      coupon.status === "USED" ? "ใช้แล้ว" : "หมดอายุแล้ว"
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
