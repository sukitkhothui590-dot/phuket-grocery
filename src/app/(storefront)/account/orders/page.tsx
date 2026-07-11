"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Package, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { getOrders } from "@/lib/api/orders";
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_GROUPS,
  matchesOrderGroup,
  type OrderStatusGroup,
} from "@/lib/order-status";
import type { Order } from "@/types";

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatItemCount(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<OrderStatusGroup>("all");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function load() {
      const baseOrders = await getOrders(accessToken);
      setOrders(baseOrders);
      setLoading(false);
    }

    void load();
  }, [accessToken]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => matchesOrderGroup(order, group));
  }, [group, orders]);

  const orderCounts = useMemo(() => {
    return ORDER_STATUS_GROUPS.reduce<Record<OrderStatusGroup, number>>(
      (acc, item) => {
        acc[item.value] = orders.filter((order) =>
          matchesOrderGroup(order, item.value)
        ).length;
        return acc;
      },
      {
        all: 0,
        active: 0,
        waiting: 0,
        completed: 0,
        cancelled: 0,
      }
    );
  }, [orders]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลดคำสั่งซื้อ...
      </div>
    );
  }

  return (
    <main className="bg-slate-50 py-8">
      <section className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">My Orders</p>
                <h1 className="mt-1 text-2xl font-semibold text-foreground">
                  คำสั่งซื้อของฉัน
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  ติดตามสถานะคำสั่งซื้อ ดูรายการที่กำลังจัดส่ง และเช็กออเดอร์ที่รับสินค้าแล้วในหน้าเดียว
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-slate-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-foreground">
                    {orderCounts.all}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">ทุกคำสั่งซื้อ</p>
                </div>
                <div className="rounded-xl border bg-sky-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-sky-700">
                    {orderCounts.active}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">กำลังดำเนินการ</p>
                </div>
                <div className="rounded-xl border bg-indigo-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-indigo-700">
                    {orderCounts.waiting}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">รอรับสินค้า</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUS_GROUPS.map((item) => {
                const active = group === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGroup(item.value)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {orderCounts[item.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-6">
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-slate-50 px-6 py-14 text-center">
                <Package className="mx-auto h-12 w-12 text-slate-300" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  ยังไม่มีรายการในหมวดนี้
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  ลองเปลี่ยนแท็บสถานะ หรือกลับไปเลือกสินค้าที่หน้าร้านเพื่อสร้างคำสั่งซื้อใหม่
                </p>
                <Link href="/">
                  <Button className="mt-5 rounded-full px-5">กลับไปเลือกสินค้า</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const status = ORDER_STATUS_CONFIG[order.status];
                  const itemCount = formatItemCount(order);
                  const firstItem = order.items[0];

                  return (
                    <article
                      key={order.id}
                      className="overflow-hidden rounded-2xl border bg-white"
                    >
                      <div className="flex flex-col gap-3 border-b bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {order.status === "shipped" ? (
                              <Truck className="h-5 w-5" />
                            ) : (
                              <ShoppingBag className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-slate-500">
                              สั่งเมื่อ {formatOrderDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.colorClass}`}
                          >
                            {status.label}
                          </span>
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="ghost" className="gap-1 text-primary">
                              รายละเอียด
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="flex gap-4">
                          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-50">
                            <img
                              src={firstItem.productImage}
                              alt={firstItem.productName}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-semibold text-foreground">
                              {firstItem.productName}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {firstItem.selectedUnit.labelTh} x {firstItem.quantity}
                            </p>
                            {order.items.length > 1 && (
                              <p className="mt-2 text-xs text-slate-400">
                                และสินค้าอื่นอีก {order.items.length - 1} รายการ
                              </p>
                            )}
                            <p className="mt-3 text-xs leading-6 text-slate-500">
                              {status.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm lg:grid-cols-1">
                          <div>
                            <p className="text-xs text-slate-400">จำนวนสินค้ารวม</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {itemCount} ชิ้น
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">การชำระเงิน</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {order.paymentMethod === "cod"
                                ? "เก็บเงินปลายทาง"
                                : "โอนผ่านบัญชี"}
                            </p>
                          </div>
                          <div className="col-span-2 lg:col-span-1">
                            <p className="text-xs text-slate-400">ยอดชำระทั้งหมด</p>
                            <p className="mt-1 text-lg font-semibold text-destructive">
                              ฿{order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
