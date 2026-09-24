"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffOrdersHeader } from "@/components/staff/staff-orders-header";
import { getStaffOrders, type StaffOrder } from "@/lib/api/orders";

export const STAFF_COMPLETED_STORAGE_KEY = "phuket-grocery-staff-preparation-completed";

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "เวลาไม่ระบุ";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function orderItemCount(order: StaffOrder) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

export function StaffOrderQueue() {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [search, setSearch] = useState("");
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STAFF_COMPLETED_STORAGE_KEY);
      const ids: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(ids) && ids.every((id) => typeof id === "string") ? ids : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    getStaffOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "โหลดคำสั่งซื้อไม่สำเร็จ");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    const handleCompleted = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") {
        setCompletedIds((current) => current.includes(id) ? current : [...current, id]);
      }
    };
    const handleReset = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id === "string") {
        setCompletedIds((current) => current.filter((completedId) => completedId !== id));
      }
    };
    window.addEventListener("staff-order-preparation-completed", handleCompleted);
    window.addEventListener("staff-order-preparation-reset", handleReset);
    return () => {
      window.removeEventListener("staff-order-preparation-completed", handleCompleted);
      window.removeEventListener("staff-order-preparation-reset", handleReset);
    };
  }, []);

  const query = search.trim().toLocaleLowerCase();
  const reloadOrders = () => {
    setError("");
    setLoading(true);
    setReloadKey((key) => key + 1);
  };
  const restoreMockCompletedOrders = () => {
    setCompletedIds([]);
    try {
      window.localStorage.setItem(STAFF_COMPLETED_STORAGE_KEY, JSON.stringify([]));
    } catch {
      // Keep the queue usable if browser storage is unavailable.
    }
  };
  const visibleOrders = orders.filter((order) => {
    if (completedIds.includes(order.id)) return false;
    return (
      !query ||
      order.orderNumber.toLocaleLowerCase().includes(query) ||
      order.customerName.toLocaleLowerCase().includes(query) ||
      order.customerPhone.includes(query)
    );
  });
  const needsLogin = error.includes("กรุณาเข้าสู่ระบบ") || error.includes("เซสชันหมดอายุ");

  return (
    <div className="min-h-screen bg-[#f6f7f7] text-[#1a2b2c]">
      <StaffOrdersHeader />
      <main className="mx-auto max-w-[1320px] px-4 py-5 sm:px-7 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">คำสั่งซื้อที่ต้องจัด</h1>
          <p className="mt-2 text-sm text-slate-600">เลือกออเดอร์ ตรวจสินค้า แล้วส่งต่อให้ฝ่ายจัดส่ง</p>
        </div>
        <section className="overflow-hidden rounded-md border border-[#dce5e5] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#e7efee] p-4 xl:flex-row xl:items-center xl:justify-between sm:px-5">
            <h2 className="shrink-0 text-sm font-semibold">รอจัดสินค้า {!loading && !error ? `(${visibleOrders.length})` : ""}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative block w-full sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ค้นหาเลขออเดอร์ / ลูกค้า / เบอร์โทร"
                  aria-label="ค้นหาออเดอร์"
                  className="h-10 rounded-lg border-slate-200 pl-9"
                />
              </label>
              {completedIds.length > 0 ? (
                <Button type="button" variant="outline" className="h-10 rounded-lg border-[#cce4e3] bg-white" onClick={restoreMockCompletedOrders}>
                  แสดงรายการที่ทดลองเสร็จ ({completedIds.length})
                </Button>
              ) : null}
              <Button type="button" variant="outline" className="h-10 gap-2 rounded-lg border-[#cce4e3] bg-white" onClick={reloadOrders} disabled={loading}>
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                รีเฟรช
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid min-h-64 place-items-center text-sm text-slate-500">
              <span className="flex items-center gap-2"><LoaderCircle className="size-5 animate-spin text-[#19b3b1]" />กำลังโหลดคิวจากหลังบ้าน...</span>
            </div>
          ) : error ? (
            <div className="grid min-h-64 place-items-center p-6 text-center">
              <div className="max-w-md">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600"><ShieldCheck className="size-5" /></div>
                <p className="mt-3 font-semibold text-[#183130]">โหลดคิวออเดอร์ไม่ได้</p>
                <p className="mt-1 text-sm text-slate-600">{error}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {needsLogin ? (
                    <Link href="/login?redirect=%2Fstaff%2Forders" className="inline-flex h-10 items-center justify-center rounded-lg bg-[#e32329] px-4 text-sm font-semibold text-white hover:bg-[#c91e24]">เข้าสู่ระบบ</Link>
                  ) : null}
                  <Button type="button" variant="outline" className="h-10 rounded-lg" onClick={reloadOrders}>ลองโหลดอีกครั้ง</Button>
                </div>
              </div>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="grid min-h-64 place-items-center p-6 text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e8f7f5] text-[#138d8b]"><PackageCheck className="size-6" /></div>
                <h3 className="mt-3 font-semibold">{query ? "ไม่พบคำสั่งซื้อที่ค้นหา" : "ไม่มีคำสั่งซื้อรอจัด"}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{query ? "ลองค้นด้วยเลขออเดอร์ ชื่อลูกค้า หรือเบอร์โทรอื่น" : "เมื่อมีคำสั่งซื้อพร้อมจัด รายการจะแสดงที่นี่"}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="hidden grid-cols-[1fr_1.2fr_1fr_110px_130px] gap-4 border-b bg-[#f4f9f9] px-5 py-3 text-xs text-slate-600 lg:grid">
                <span>เลขคำสั่งซื้อ</span><span>ลูกค้า</span><span>วันที่สั่งซื้อ</span><span>สินค้า</span><span className="text-right">ดำเนินการ</span>
              </div>
              <div className="divide-y divide-[#edf2f1]">
              {visibleOrders.map((order) => (
                <article key={order.id} className="grid gap-3 p-4 transition-colors hover:bg-[#f8fbfa] sm:px-5 lg:grid-cols-[1fr_1.2fr_1fr_110px_130px] lg:items-center lg:gap-4 lg:py-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-all text-sm font-semibold text-[#163b3a]">{order.orderNumber}</h3>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="mt-1 truncate text-sm font-semibold">{order.customerName || "ไม่ระบุชื่อผู้รับ"}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{order.customerPhone || order.shippingAddress.phone || "ไม่ระบุเบอร์โทร"}</p>
                  </div>
                  <div className="text-xs leading-6 text-slate-600">{formatOrderDate(order.createdAt)}</div>
                  <div className="text-sm">
                    <p>{order.items.length} รายการ</p>
                    <p className="mt-1 text-xs text-slate-500">{orderItemCount(order)} หน่วย</p>
                  </div>
                  <Link href={`/staff/orders/${encodeURIComponent(order.id)}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-[#bcdedd] px-3 text-sm font-medium text-[#087f7d] transition-colors hover:bg-[#edf8f8] focus-visible:outline-2 focus-visible:outline-[#19b3b1]">
                    จัดสินค้า <ArrowRight className="size-4" />
                  </Link>
                </article>
              ))}
              </div>
            </div>
          )}
        </section>
        <p className="mt-4 text-xs leading-5 text-slate-500">โหมดทดลอง: แสดงคำสั่งซื้อจริง แต่ผลการตรวจสินค้ายังไม่ส่งไปหลังบ้าน</p>
      </main>
    </div>
  );
}
