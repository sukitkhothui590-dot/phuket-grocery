"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/api/orders";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

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

      const apiOrder = await getOrderById(id);
      if (apiOrder) setOrder(apiOrder);
    }
    if (id) load();
  }, [id]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">สั่งซื้อสำเร็จ!</h1>
        <p className="mt-2 text-muted-foreground">
          ขอบคุณสำหรับคำสั่งซื้อ เราจะดำเนินการจัดส่งให้เร็วที่สุด
        </p>
      </div>

      {order ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              คำสั่งซื้อ #{order.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">สถานะ</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  ORDER_STATUS_MAP[order.status]?.color
                )}
              >
                {ORDER_STATUS_MAP[order.status]?.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">วิธีชำระเงิน</span>
              <span>
                {order.paymentMethod === "bank_transfer"
                  ? "โอนเงินผ่านธนาคาร"
                  : "เก็บเงินปลายทาง"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">วิธีจัดส่ง</span>
              <span>
                {order.shippingMethod === "standard"
                  ? "จัดส่งปกติ"
                  : "จัดส่งด่วน"}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.productName} &times; {item.quantity}
                  </span>
                  <span>฿{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ยอดสินค้า</span>
                <span>฿{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>ส่วนลด</span>
                  <span>-฿{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าจัดส่ง</span>
                <span>
                  {order.shippingCost === 0
                    ? "ฟรี"
                    : `฿${order.shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>รวมทั้งสิ้น</span>
                <span className="text-primary">
                  ฿{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              คำสั่งซื้อ #{id} ถูกบันทึกเรียบร้อยแล้ว
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/account/orders/${id}`}
          className={cn(buttonVariants({ variant: "default" }), "gap-2")}
        >
          ดูรายละเอียดคำสั่งซื้อ
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}
