"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Mail, Package, Phone, Settings, Ticket, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { getOrders } from "@/lib/api/orders";
import { matchesOrderGroup } from "@/lib/order-status";
import type { Order } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, accessToken } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function loadOrders() {
      if (!accessToken) return;
      setOrders(await getOrders(accessToken));
    }

    void loadOrders();
  }, [accessToken]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      active: orders.filter((order) => matchesOrderGroup(order, "active")).length,
      waiting: orders.filter((order) => matchesOrderGroup(order, "waiting")).length,
      completed: orders.filter((order) => matchesOrderGroup(order, "completed")).length,
    };
  }, [orders]);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลดบัญชีผู้ใช้...
      </div>
    );
  }

  return (
    <main className="bg-slate-50 py-8">
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <article className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-6">
              <p className="text-sm font-medium text-primary">My Account</p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">
                บัญชีของฉัน
              </h1>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-slate-500">ลูกค้าสมาชิก Phuket Grocery</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{user.phone}</span>
                </div>
              </div>

              <Link href="/account/profile">
                <Button variant="outline" className="w-full rounded-full">
                  แก้ไขข้อมูลส่วนตัว
                </Button>
              </Link>
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-6">
                <h2 className="text-xl font-semibold text-foreground">
                  สถานะคำสั่งซื้อ
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  เช็กภาพรวมคำสั่งซื้อที่กำลังดำเนินการ รอรับสินค้า และรายการที่จัดส่งสำเร็จแล้ว
                </p>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">ทั้งหมด</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-2xl border bg-sky-50 p-4">
                  <p className="text-sm text-slate-500">สั่งสินค้า</p>
                  <p className="mt-2 text-3xl font-semibold text-sky-700">
                    {stats.active}
                  </p>
                </div>
                <div className="rounded-2xl border bg-indigo-50 p-4">
                  <p className="text-sm text-slate-500">รอสินค้า</p>
                  <p className="mt-2 text-3xl font-semibold text-indigo-700">
                    {stats.waiting}
                  </p>
                </div>
                <div className="rounded-2xl border bg-emerald-50 p-4">
                  <p className="text-sm text-slate-500">รับสินค้าแล้ว</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-700">
                    {stats.completed}
                  </p>
                </div>
              </div>

              <div className="border-t px-6 py-5">
                <Link href="/account/orders">
                  <Button className="rounded-full px-5">ดูคำสั่งซื้อทั้งหมด</Button>
                </Link>
              </div>
            </article>

            <article className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-foreground">ทางลัด</h2>
              </div>

              <div className="grid gap-3 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "คูปองส่วนลด",
                    href: "/coupons",
                    icon: Ticket,
                  },
                  {
                    label: "คำสั่งซื้อของฉัน",
                    href: "/account/orders",
                    icon: Package,
                  },
                  {
                    label: "รอรับสินค้า",
                    href: "/account/orders",
                    icon: Truck,
                  },
                  {
                    label: "จัดการโปรไฟล์",
                    href: "/account/profile",
                    icon: Settings,
                  },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl border bg-slate-50 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-white"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
