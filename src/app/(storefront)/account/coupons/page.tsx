"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { getAvailableCoupons, getMyCoupons } from "@/lib/api/coupons";
import { useAuthStore } from "@/stores/auth-store";
import type { ClaimableCoupon, SavedCoupon } from "@/types";

export default function MyCouponsPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [history, setHistory] = useState<SavedCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const available = await getAvailableCoupons();
    setCoupons(available.coupons);

    if (accessToken) {
      const mine = await getMyCoupons({
        token: accessToken,
        status: "USED",
        limit: 20,
      });
      setHistory(mine.coupons);
    } else {
      setHistory([]);
    }

    setLoading(false);
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <TicketPercent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">คูปองพร้อมใช้</h1>
            <p className="text-xs text-muted-foreground">
              คูปองจากร้านแสดงที่นี่อัตโนมัติ เลือกใช้ตอนชำระเงินได้เลย
            </p>
          </div>
        </div>
        <Link
          href="/coupons"
          className="self-start text-sm font-medium text-primary hover:underline sm:self-auto"
        >
          ดูคูปองทั้งหมด →
        </Link>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-14 text-center text-sm text-muted-foreground">
          กำลังโหลดคูปอง...
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">ยังไม่มีคูปองพร้อมใช้</p>
          <Link
            href="/coupons"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            ไปหน้าคูปอง
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <CouponVoucherCard
                key={coupon.id}
                coupon={coupon}
                detailed
                actionLabel="ใช้ที่ตะกร้า"
                onAction={() =>
                  router.push(`/cart?coupon=${encodeURIComponent(coupon.code)}`)
                }
              />
            ))}
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
          >
            ไปตะกร้าเพื่อใช้คูปอง →
          </Link>
        </>
      )}

      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="text-base font-semibold text-foreground">
            ประวัติคูปองที่ใช้แล้ว
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((coupon) => (
              <CouponVoucherCard
                key={coupon.id}
                coupon={coupon}
                detailed
                claimed
                disabled
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
