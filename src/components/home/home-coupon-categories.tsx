"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Percent, TicketPercent, Truck } from "lucide-react";
import { COUPON_CATEGORIES } from "@/lib/coupons/catalog";
import { getAvailableCoupons } from "@/lib/api/coupons";
import { useAuthStore } from "@/stores/auth-store";

const ICONS = {
  shipping: Truck,
  order_discount: Percent,
} as const;

export function HomeCouponCategories() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [counts, setCounts] = useState({ shipping: 0, order_discount: 0 });

  useEffect(() => {
    void getAvailableCoupons({ token: accessToken }).then((result) => {
      // Count by fetching both categories for accurate totals when filtered response is mixed
      const shipping = result.coupons.filter((c) => c.category === "shipping")
        .length;
      const orderDiscount = result.coupons.filter(
        (c) => c.category === "order_discount",
      ).length;
      setCounts({ shipping, order_discount: orderDiscount });
    });
  }, [accessToken]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50">
            <TicketPercent className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">คูปองส่วนลด</h2>
            <p className="text-xs text-muted-foreground">
              เก็บโค้ดไว้ใช้ตอนชำระเงิน ดูเงื่อนไขและวันหมดอายุได้ชัดเจน
            </p>
          </div>
        </div>

        <Link
          href="/coupons"
          className="flex items-center gap-1 self-end text-sm font-medium text-primary hover:underline sm:self-auto"
        >
          ดูทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {COUPON_CATEGORIES.map((category) => {
          const Icon = ICONS[category.id];
          const count = counts[category.id];

          return (
            <Link
              key={category.id}
              href={`/coupons?type=${category.id}`}
              className="group flex items-center gap-4 rounded-lg border bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                    {category.title}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {count} โค้ด
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {category.subtitle}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
