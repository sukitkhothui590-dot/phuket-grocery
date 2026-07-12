"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { getOrderById } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/api/token";
import { SalesReceipt } from "@/components/order/sales-receipt";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const stored = sessionStorage.getItem(`order-${id}`);
        if (stored) {
          setOrder(JSON.parse(stored) as Order);
          setLoading(false);
          return;
        }
      } catch {
        /* sessionStorage unavailable */
      }

      const apiOrder = await getOrderById(id, getAccessToken());
      setOrder(apiOrder);
      setLoading(false);
    }
    if (id) void load();
  }, [id]);

  return (
    <div className="bg-slate-100 print:bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 print:max-w-none print:px-0 print:py-0">
        <div
          className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          data-print-hide
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              เอกสารใบเสร็จ
            </p>
            <h1 className="mt-1 text-xl font-bold text-foreground">
              ใบเสร็จรับเงิน
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              หน้านี้สำหรับดูและพิมพ์ใบเสร็จเท่านั้น แยกจากหน้ายืนยันคำสั่งซื้อ
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/account/orders/${id}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 gap-2 rounded-xl",
              )}
            >
              <ArrowLeft className="size-4" />
              กลับออเดอร์
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!order}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 gap-2 rounded-xl",
              )}
            >
              <Printer className="size-4" />
              พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center text-sm text-muted-foreground print:hidden">
            กำลังโหลดใบเสร็จ...
          </div>
        ) : order ? (
          <SalesReceipt order={order} />
        ) : (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center text-sm text-muted-foreground print:hidden">
            ไม่พบข้อมูลใบเสร็จของคำสั่งซื้อนี้
          </div>
        )}
      </div>
    </div>
  );
}
