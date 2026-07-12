"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { getAvailableCoupons } from "@/lib/api/coupons";
import type { ClaimableCoupon } from "@/types";

export default function MyCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAvailableCoupons();
    setCoupons(result.coupons);
    setLoading(false);
  }, []);

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
              คูปองที่ร้านเพิ่มให้จะแสดงที่นี่อัตโนมัติ ไม่ต้องเก็บเอง
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
                onAction={() => router.push("/cart")}
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
    </main>
  );
}
