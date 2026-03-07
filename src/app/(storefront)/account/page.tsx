"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getOrders } from "@/lib/api/orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import {
  User,
  Package,
  Settings,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function loadOrders() {
      const data = await getOrders();
      setOrders(data);
    }
    loadOrders();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  const pendingCount = orders.filter(
    (o) => o.status === "pending_payment" || o.status === "pending_verify"
  ).length;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">บัญชีของฉัน</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-medium">
              {user.firstName} {user.lastName}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              {user.phone}
            </div>
            <Link
              href="/account/profile"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-2 gap-1"
              )}
            >
              แก้ไขข้อมูล
              <ChevronRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              คำสั่งซื้อ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-primary/5 p-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {orders.length}
                </p>
                <p className="text-xs text-muted-foreground">ทั้งหมด</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  กำลังดำเนินการ
                </p>
              </div>
            </div>
            <Link
              href="/account/orders"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-2 gap-1"
              )}
            >
              ดูคำสั่งซื้อทั้งหมด
              <ChevronRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              เมนูลัด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                {
                  label: "คำสั่งซื้อของฉัน",
                  href: "/account/orders",
                  icon: Package,
                },
                {
                  label: "แก้ไขข้อมูลส่วนตัว",
                  href: "/account/profile",
                  icon: User,
                },
                {
                  label: "จัดการที่อยู่",
                  href: "/account/profile",
                  icon: Settings,
                },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                >
                  <link.icon className="size-5 text-primary" />
                  <span className="text-sm font-medium">{link.label}</span>
                  <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
