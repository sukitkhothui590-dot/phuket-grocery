"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";
import { getAccessToken } from "@/lib/api/token";
import { COMPANY_INFO, ORDER_STATUS_MAP } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Home,
  Phone,
} from "lucide-react";

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatMoney(value: number) {
  return `฿${value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CheckoutSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const stored = sessionStorage.getItem(`order-${id}`);
        if (stored) {
          setOrder(JSON.parse(stored));
          return;
        }
      } catch {
        /* sessionStorage unavailable */
      }

      const apiOrder = await getOrderById(id, getAccessToken());
      if (apiOrder) setOrder(apiOrder);
    }
    if (id) void load();
  }, [id]);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            สั่งซื้อสำเร็จ!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ขอบคุณสำหรับคำสั่งซื้อ เราจะดำเนินการจัดส่งให้เร็วที่สุด
          </p>
        </div>

        {order ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs text-muted-foreground">หมายเลขคำสั่งซื้อ</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  #{order.orderNumber}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  ORDER_STATUS_MAP[order.status]?.color,
                )}
              >
                {ORDER_STATUS_MAP[order.status]?.label}
              </span>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">วิธีชำระเงิน</dt>
                <dd className="font-medium text-foreground">
                  {order.paymentMethod === "bank_transfer"
                    ? "โอนเงินผ่านธนาคาร"
                    : "เก็บเงินปลายทาง"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">วิธีจัดส่ง</dt>
                <dd className="font-medium text-foreground">
                  {order.shippingMethod === "express"
                    ? "จัดส่งด่วน"
                    : "จัดส่งปกติ"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">จำนวนรายการ</dt>
                <dd className="font-medium text-foreground">
                  {order.items.length} รายการ
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">ส่วนลด</dt>
                  <dd className="font-medium text-emerald-700">
                    -{formatMoney(order.discount)}
                  </dd>
                </div>
              )}
              {(order.paymentFee ?? 0) > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">ค่าธรรมเนียม COD</dt>
                  <dd className="font-medium text-foreground">
                    {formatMoney(order.paymentFee ?? 0)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                <dt className="font-semibold text-foreground">ยอดชำระ</dt>
                <dd className="text-lg font-bold text-foreground">
                  {formatMoney(order.total)}
                </dd>
              </div>
            </dl>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              คำสั่งซื้อ #{id} ถูกบันทึกเรียบร้อยแล้ว
            </p>
          </section>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/account/orders/${id}/receipt`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 gap-2 rounded-xl",
            )}
          >
            <FileText className="size-4" />
            เปิดใบเสร็จรับเงิน
          </Link>
          <a
            href={toTelHref(COMPANY_INFO.phone)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-xl",
            )}
          >
            <Phone className="size-4" />
            โทรติดต่อร้าน
          </a>
          <Link
            href={`/account/orders/${id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 gap-2 rounded-xl",
            )}
          >
            ดูรายละเอียดคำสั่งซื้อ
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-11 gap-2 rounded-xl text-slate-600",
            )}
          >
            <Home className="size-4" />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
