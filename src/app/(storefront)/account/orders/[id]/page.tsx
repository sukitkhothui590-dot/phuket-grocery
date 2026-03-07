"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getOrderById } from "@/lib/api/orders";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  Check,
} from "lucide-react";

const STATUS_FLOW: OrderStatus[] = [
  "pending_payment",
  "pending_verify",
  "preparing",
  "shipped",
  "delivered",
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function load() {
      try {
        const stored = sessionStorage.getItem(`order-${id}`);
        if (stored) {
          setOrder(JSON.parse(stored));
          setLoading(false);
          return;
        }
      } catch {
        /* sessionStorage unavailable */
      }

      const data = await getOrderById(id);
      setOrder(data);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <Package className="mx-auto size-16 text-muted-foreground/30" />
        <h1 className="mt-4 text-xl font-medium">ไม่พบคำสั่งซื้อ</h1>
        <p className="mt-2 text-muted-foreground">
          คำสั่งซื้อนี้ไม่มีอยู่ในระบบ
        </p>
        <Link
          href="/account/orders"
          className={cn(buttonVariants({ variant: "default" }), "mt-6")}
        >
          กลับไปรายการคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          กลับไปรายการคำสั่งซื้อ
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            คำสั่งซื้อ #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            วันที่สั่งซื้อ:{" "}
            {new Date(order.createdAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            ORDER_STATUS_MAP[order.status]?.color
          )}
        >
          {ORDER_STATUS_MAP[order.status]?.label}
        </span>
      </div>

      {/* Status timeline */}
      {!isCancelled && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              {STATUS_FLOW.map((status, i) => {
                const isActive = i <= currentStatusIndex;
                const isCurrent = i === currentStatusIndex;
                return (
                  <div key={status} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex size-8 items-center justify-center rounded-full text-xs font-medium",
                          isActive
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isActive && !isCurrent ? (
                          <Check className="size-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-1.5 text-center text-[10px] leading-tight sm:text-xs",
                          isActive
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {ORDER_STATUS_MAP[status]?.label}
                      </span>
                    </div>
                    {i < STATUS_FLOW.length - 1 && (
                      <div
                        className={cn(
                          "mx-1 h-0.5 flex-1 sm:mx-2",
                          i < currentStatusIndex ? "bg-primary" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                รายการสินค้า ({order.items.length} รายการ)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4">
                    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {item.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedUnit.labelTh} &times; {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium">
                      ฿{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                ที่อยู่จัดส่ง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.phone}
              </p>
              <p className="mt-1 text-sm">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 &&
                  `, ${order.shippingAddress.addressLine2}`}
              </p>
              <p className="text-sm">
                {order.shippingAddress.subDistrict},{" "}
                {order.shippingAddress.district},{" "}
                {order.shippingAddress.province}{" "}
                {order.shippingAddress.postalCode}
              </p>
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                ข้อมูลการชำระเงิน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">วิธีชำระเงิน</span>
                <span>
                  {order.paymentMethod === "bank_transfer"
                    ? "โอนเงินผ่านธนาคาร"
                    : "เก็บเงินปลายทาง (COD)"}
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
              {order.slipImage && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    สลิปการโอน
                  </p>
                  <div className="w-48 overflow-hidden rounded-lg border">
                    <img
                      src={order.slipImage}
                      alt="สลิป"
                      className="w-full object-contain"
                    />
                  </div>
                  {order.slipUploadedAt && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      อัปโหลดเมื่อ{" "}
                      {new Date(order.slipUploadedAt).toLocaleDateString(
                        "th-TH",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Totals sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>สรุปยอด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดสินค้า</span>
                  <span>฿{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      ส่วนลด{" "}
                      {order.couponCode && `(${order.couponCode})`}
                    </span>
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
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>รวมทั้งสิ้น</span>
                <span className="text-primary">
                  ฿{order.total.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
