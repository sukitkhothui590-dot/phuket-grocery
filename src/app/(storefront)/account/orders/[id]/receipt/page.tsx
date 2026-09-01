"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Phone, Printer } from "lucide-react";
import { getOrderReceipt, type OrderReceiptResult } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/api/token";
import { SalesReceipt } from "@/components/order/sales-receipt";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Sales line: printed on the hold page so the customer has somewhere to ask. */
const SALES_PHONE = "076-355207";
const SALES_PHONE_EXTENSIONS = "กด 2 หรือ กด 3";

export default function OrderReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [receipt, setReceipt] = useState<OrderReceiptResult | null>(null);

  useEffect(() => {
    // ponytail: no sessionStorage/cache read on purpose — this document is
    // staff-released, so every view re-asks the server whether it is released.
    async function load() {
      setReceipt(await getOrderReceipt(id, getAccessToken()));
    }
    if (id) void load();
  }, [id]);

  const released = receipt?.state === "released";

  return (
    <div className="bg-slate-100 print:bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8 print:max-w-none print:px-0 print:py-0">
        <div
          className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          data-print-hide
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              เอกสารใบสั่งซื้อ
            </p>
            <h1 className="mt-1 text-xl font-bold text-foreground">
              ใบสั่งซื้อ
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              หน้านี้สำหรับดูและพิมพ์ใบสั่งซื้อ จะเปิดให้ดูได้หลังพนักงานตรวจสอบและอนุมัติ
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
            {released && (
              <button
                type="button"
                onClick={() => window.print()}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-10 gap-2 rounded-xl",
                )}
              >
                <Printer className="size-4" />
                พิมพ์ใบสั่งซื้อ
              </button>
            )}
          </div>
        </div>

        {receipt === null ? (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center text-sm text-muted-foreground print:hidden">
            กำลังโหลดใบสั่งซื้อ...
          </div>
        ) : receipt.state === "released" ? (
          <SalesReceipt order={receipt.order} />
        ) : receipt.state === "pending" ? (
          <section className="rounded-2xl border bg-white px-6 py-10 text-center shadow-sm print:hidden">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock className="size-7" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              อยู่ระหว่างการตรวจสอบ
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              กำลังจัดเตรียมสินค้าเพื่อจัดส่ง
            </p>
            {receipt.orderNumber && (
              <p className="mt-4 text-sm text-foreground">
                เลขที่ใบสั่งซื้อ{" "}
                <span className="font-semibold">{receipt.orderNumber}</span>
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              สอบถามเพิ่มเติม ติดต่อฝ่ายขาย{" "}
              <a
                href={`tel:${SALES_PHONE.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <Phone className="size-4" />
                {SALES_PHONE} {SALES_PHONE_EXTENSIONS}
              </a>
            </p>
          </section>
        ) : (
          <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center text-sm text-muted-foreground print:hidden">
            ไม่พบข้อมูลใบสั่งซื้อของคำสั่งซื้อนี้
          </div>
        )}
      </div>
    </div>
  );
}
