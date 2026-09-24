"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Barcode,
  Check,
  CheckCheck,
  Clock3,
  LoaderCircle,
  PackageCheck,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaffOrdersHeader } from "@/components/staff/staff-orders-header";
import {
  getStaffOrderById,
  type StaffOrder,
} from "@/lib/api/orders";
import { STAFF_COMPLETED_STORAGE_KEY } from "@/components/staff/staff-order-queue";
import type { OrderItem } from "@/types";

type ScanMessage = { kind: "success" | "error"; text: string };
type PreparationMock = {
  started: boolean;
  completed: boolean;
  scanned: Record<string, number>;
};

const PREPARATION_MOCK_STORAGE_KEY = "phuket-grocery-staff-preparation-mock";

function itemKey(item: OrderItem, index: number) {
  return item.id ?? `${item.productId}:${item.selectedUnit.id ?? item.selectedUnit.sku}:${index}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "เวลาไม่ระบุ"
    : new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readPreparationMock(orderId: string, items: OrderItem[]): PreparationMock {
  const empty: PreparationMock = { started: false, completed: false, scanned: {} };
  try {
    const raw = window.localStorage.getItem(PREPARATION_MOCK_STORAGE_KEY);
    const saved = asRecord(raw ? JSON.parse(raw) : null);
    const orderProgress = asRecord(saved?.[orderId]);
    const savedCounts = asRecord(orderProgress?.scanned);
    if (!orderProgress) return empty;

    return {
      started: orderProgress.started === true,
      completed: orderProgress.completed === true,
      scanned: Object.fromEntries(items.map((item, index) => {
        const key = itemKey(item, index);
        const value = savedCounts?.[key];
        const count = typeof value === "number" && Number.isFinite(value)
          ? Math.max(0, Math.min(item.quantity, Math.floor(value)))
          : 0;
        return [key, count];
      })),
    };
  } catch {
    return empty;
  }
}

function writePreparationMock(orderId: string, progress: PreparationMock) {
  try {
    const raw = window.localStorage.getItem(PREPARATION_MOCK_STORAGE_KEY);
    const saved = asRecord(raw ? JSON.parse(raw) : null) ?? {};
    window.localStorage.setItem(
      PREPARATION_MOCK_STORAGE_KEY,
      JSON.stringify({ ...saved, [orderId]: progress }),
    );
  } catch {
    // The mock remains usable in memory when browser storage is unavailable.
  }
}

function mockBarcode(item: OrderItem) {
  return item.barcode?.trim() || item.selectedUnit.sku.trim();
}

export function StaffOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<StaffOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [barcode, setBarcode] = useState("");
  const [mockProgress, setMockProgress] = useState<PreparationMock>({ started: false, completed: false, scanned: {} });
  const [scanMessage, setScanMessage] = useState<ScanMessage | null>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    getStaffOrderById(orderId)
      .then((data) => {
        if (!active) return;
        setOrder(data);
        setMockProgress(readPreparationMock(data.id, data.items));
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "โหลดรายละเอียดออเดอร์ไม่สำเร็จ");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  const isStarted = mockProgress.started;
  const isCompleted = mockProgress.completed;
  const scannedTotal = order?.items.reduce((sum, item, index) => sum + (mockProgress.scanned[itemKey(item, index)] ?? 0), 0) ?? 0;
  const requestedTotal = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const allScanned = requestedTotal > 0 && scannedTotal === requestedTotal;
  const progressPercent = requestedTotal > 0 ? Math.round((scannedTotal / requestedTotal) * 100) : 0;

  useEffect(() => {
    if (isStarted && !isCompleted && order?.status === "preparing") {
      scanInputRef.current?.focus();
    }
  }, [isStarted, isCompleted, order?.status]);

  const handleStart = () => {
    if (!order || order.status !== "preparing") return;
    setError("");
    const next = { ...mockProgress, started: true };
    setMockProgress(next);
    writePreparationMock(order.id, next);
  };

  const processBarcode = (value: string) => {
    if (!order || !isStarted || isCompleted || order.status !== "preparing") return;
    const normalized = value.trim();
    if (!normalized) return;

    const matchIndex = order.items.findIndex((item, index) =>
      mockBarcode(item) === normalized && (mockProgress.scanned[itemKey(item, index)] ?? 0) < item.quantity,
    );
    if (matchIndex < 0) {
      const matchingItem = order.items.find((item) => mockBarcode(item) === normalized);
      setScanMessage({
        kind: "error",
        text: matchingItem
          ? `สแกน ${matchingItem.productName} ครบตามจำนวนแล้ว`
          : `ไม่พบรหัส ${normalized} ในรายการออเดอร์นี้`,
      });
      return;
    }

    const item = order.items[matchIndex];
    const key = itemKey(item, matchIndex);
    const next = {
      ...mockProgress,
      scanned: { ...mockProgress.scanned, [key]: (mockProgress.scanned[key] ?? 0) + 1 },
    };
    setMockProgress(next);
    writePreparationMock(order.id, next);
    setScanMessage({ kind: "success", text: `ตรวจสอบแล้ว: ${item.productName} · ${item.selectedUnit.labelTh}` });
  };

  const handleScan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    processBarcode(barcode);
    setBarcode("");
  };

  const handleMockScan = () => {
    if (!order) return;
    const nextItem = order.items.find((item, index) =>
      (mockProgress.scanned[itemKey(item, index)] ?? 0) < item.quantity && Boolean(mockBarcode(item)),
    );
    if (!nextItem) {
      setScanMessage({ kind: "error", text: "ไม่มีรายการที่เหลือให้จำลองสแกนแล้ว" });
      return;
    }
    processBarcode(mockBarcode(nextItem));
  };

  const handleComplete = () => {
    if (!order || !allScanned || order.status !== "preparing") return;
    const next = { ...mockProgress, completed: true };
    setMockProgress(next);
    writePreparationMock(order.id, next);
    setScanMessage({ kind: "success", text: "จำลองจัดเตรียมเสร็จแล้ว ข้อมูลยังไม่ถูกส่งไปหลังบ้าน" });
    window.dispatchEvent(new CustomEvent("staff-order-preparation-completed", { detail: order.id }));
    try {
      const saved = window.localStorage.getItem(STAFF_COMPLETED_STORAGE_KEY);
      const ids: unknown = saved ? JSON.parse(saved) : [];
      const completedIds = Array.isArray(ids) && ids.every((id) => typeof id === "string") ? ids : [];
      if (!completedIds.includes(order.id)) {
        window.localStorage.setItem(STAFF_COMPLETED_STORAGE_KEY, JSON.stringify([...completedIds, order.id]));
      }
    } catch {
      // The screen can still complete this mock session without browser storage.
    }
  };

  const handleResetMock = () => {
    if (!order) return;
    const next: PreparationMock = {
      started: false,
      completed: false,
      scanned: Object.fromEntries(order.items.map((item, index) => [itemKey(item, index), 0])),
    };
    setMockProgress(next);
    setScanMessage(null);
    writePreparationMock(order.id, next);
    try {
      const saved = window.localStorage.getItem(STAFF_COMPLETED_STORAGE_KEY);
      const ids: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(ids) && ids.every((id) => typeof id === "string")) {
        window.localStorage.setItem(STAFF_COMPLETED_STORAGE_KEY, JSON.stringify(ids.filter((id) => id !== order.id)));
      }
    } catch {
      // Reset the in-memory mock even when browser storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent("staff-order-preparation-reset", { detail: order.id }));
  };

  return (
    <div className="min-h-screen bg-[#f6f7f7] text-[#1a2b2c]">
      <StaffOrdersHeader back />
      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-7 sm:py-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">จัดเตรียมสินค้า</h1>
            <p className="mt-2 text-sm text-slate-600">ตรวจรหัสและจำนวนให้ตรงกับใบสั่งซื้อ</p>
          </div>
          <p className="text-xs text-slate-500">โหมดทดลอง · ยังไม่ส่งผลไปหลังบ้าน</p>
        </div>

        {loading ? (
          <div className="grid min-h-72 place-items-center rounded-2xl border border-[#d9e8e7] bg-white text-sm text-slate-500 shadow-sm">
            <span className="flex items-center gap-2"><LoaderCircle className="size-5 animate-spin text-[#19b3b1]" />กำลังโหลดข้อมูลออเดอร์...</span>
          </div>
        ) : error && !order ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-[#183130]">เปิดออเดอร์ไม่สำเร็จ</p>
            <p className="mt-2 text-sm text-slate-600">{error}</p>
            <div className="mt-4 flex justify-center gap-2">
              <Link href="/staff/orders" className="inline-flex h-10 items-center rounded-lg border border-[#cce4e3] px-4 text-sm font-medium">กลับคิว</Link>
              {error.includes("กรุณาเข้าสู่ระบบ") || error.includes("เซสชันหมดอายุ") ? (
                <Link href={`/login?redirect=${encodeURIComponent(`/staff/orders/${orderId}`)}`} className="inline-flex h-10 items-center rounded-lg bg-[#e32329] px-4 text-sm font-semibold text-white hover:bg-[#c91e24]">เข้าสู่ระบบ</Link>
              ) : null}
              <Button className="h-10 bg-[#19b3b1] text-white hover:bg-[#149d9b]" onClick={() => window.location.reload()}>ลองอีกครั้ง</Button>
            </div>
          </div>
        ) : order ? (
          <>
            <section className="mb-5 overflow-hidden rounded-md border border-[#dce5e5] bg-white">
              <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">คำสั่งซื้อ</p>
                  <h2 className="mt-1 break-all text-lg font-semibold">{order.orderNumber}</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 py-1.5 text-xs font-medium text-[#087f7d]">
                  <Clock3 className="size-3.5" />{order.status === "preparing" ? "กำลังเตรียมสินค้า" : order.status}
                </span>
              </div>
              <div className="grid gap-4 border-t border-[#e7efee] bg-[#fbfdfc] px-4 py-3 text-sm sm:grid-cols-3 sm:px-6">
                <div><p className="text-[11px] font-medium text-slate-500">เวลาสั่งซื้อ</p><p className="mt-1 font-medium">{formatDate(order.createdAt)}</p></div>
                <div><p className="text-[11px] font-medium text-slate-500">ผู้รับสินค้า</p><p className="mt-1 font-medium">{order.shippingAddress.fullName || order.customerName || "ไม่ระบุชื่อ"}</p><p className="mt-0.5 text-xs text-slate-500">{order.customerPhone || order.shippingAddress.phone || "ไม่ระบุเบอร์โทร"}</p></div>
                <div className="sm:col-span-1"><p className="text-[11px] font-medium text-slate-500">ที่อยู่จัดส่ง</p><p className="mt-1 leading-5">{[order.shippingAddress.addressLine1, order.shippingAddress.subDistrict, order.shippingAddress.district, order.shippingAddress.province, order.shippingAddress.postalCode].filter(Boolean).join(" ") || "ไม่ระบุที่อยู่"}</p></div>
              </div>
            </section>

            {order.status !== "preparing" ? (
              <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                สถานะออเดอร์ถูกเปลี่ยนในระบบหลังบ้านเป็น “{order.status}” แล้ว จึงไม่สามารถเริ่มหรือจบการจำลองได้
              </div>
            ) : null}
            {error && order ? <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="overflow-hidden rounded-md border border-[#dce5e5] bg-white">
                <div className="flex items-center justify-between gap-3 border-b border-[#e7efee] px-4 py-4 sm:px-5">
                  <div>
                    <h2 className="text-sm font-semibold">รายการตามใบสั่งซื้อ <span className="ml-2 font-normal text-slate-500">{order.items.length} รายการ</span></h2>
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">ตรวจแล้ว / ต้องจัด</span>
                </div>
                <div className="divide-y divide-[#edf2f1]">
                  {order.items.map((item, index) => {
                    const key = itemKey(item, index);
                    const count = mockProgress.scanned[key] ?? 0;
                    const done = count >= item.quantity;
                    return (
                      <article key={key} className={`grid grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 transition-colors sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:gap-4 sm:px-5 ${done ? "bg-[#f4fbf8]" : "bg-white"}`}>
                        <div className="relative size-[52px] overflow-hidden bg-white sm:size-16">
                          <Image src={item.productImage} alt={item.productName} fill sizes="64px" unoptimized className="object-contain p-1.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold leading-5">{item.productName}</p>
                          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                            <span>หน่วย <strong className="font-semibold text-[#354d4c]">{item.selectedUnit.labelTh}</strong></span>
                            <span>รหัส <strong className="font-mono font-medium text-slate-600">{mockBarcode(item) || "ไม่ระบุ"}</strong></span>
                          </div>
                        </div>
                        <div className="min-w-[58px] text-right">
                          <p className={`text-lg font-semibold tabular-nums ${done ? "text-[#13805f]" : "text-[#183130]"}`}>{count}<span className="px-1 text-slate-400">/</span>{item.quantity}</p>
                          <p className={`text-xs ${done ? "text-[#13805f]" : "text-slate-500"}`}>{done ? "ครบแล้ว" : item.selectedUnit.labelTh}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <aside className="space-y-3 lg:sticky lg:top-4">
                <section className="overflow-hidden rounded-md border border-[#dce5e5] border-t-2 border-t-[#19b3b1] bg-white">
                  <div className="flex items-center gap-2 border-b px-5 py-4">
                    <ScanLine className="size-5 text-[#087f7d]" />
                    <h2 className="text-sm font-semibold">ตรวจสินค้า</h2>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div><p className="text-xs text-slate-600">ตรวจแล้ว</p><p className="mt-1 text-2xl font-semibold tabular-nums">{scannedTotal}<span className="px-1 text-base font-normal text-slate-500">/ {requestedTotal} หน่วย</span></p></div>
                    </div>
                    <div role="progressbar" aria-label="จำนวนสินค้าที่ตรวจแล้ว" aria-valuemin={0} aria-valuemax={requestedTotal || 1} aria-valuenow={scannedTotal} className="mt-3 h-1 overflow-hidden bg-[#e9f0ef]">
                      <div className="h-full bg-[#19b3b1] transition-[width] duration-300" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{isCompleted ? "จบการจำลองแล้ว" : isStarted ? "กำลังตรวจรายการ" : "พร้อมเริ่มตรวจ"}</p>

                    {order.status === "preparing" && !isStarted && !isCompleted ? (
                      <div className="mt-5">
                        <p className="text-sm leading-6 text-slate-600">กดเริ่มจัดสินค้า แล้วสแกนหรือพิมพ์รหัสบนสินค้าทีละหน่วย</p>
                        <Button type="button" onClick={handleStart} className="mt-4 h-11 w-full rounded-lg bg-[#e32329] font-semibold text-white hover:bg-[#c91e24]">
                          <PackageCheck className="mr-2 size-4" />เริ่มจัดสินค้า
                        </Button>
                      </div>
                    ) : null}

                    {order.status === "preparing" && isStarted && !isCompleted ? (
                      <div className="mt-5 space-y-3">
                        <form onSubmit={handleScan} className="space-y-2">
                          <label htmlFor="mock-barcode" className="text-sm font-medium">สแกนบาร์โค้ด หรือพิมพ์รหัสสินค้า</label>
                          <div className="flex gap-2">
                            <Input id="mock-barcode" ref={scanInputRef} value={barcode} onChange={(event) => setBarcode(event.target.value)} placeholder="รหัสสินค้า" autoComplete="off" className="h-12 min-w-0 rounded border-slate-300 bg-white font-mono text-base focus-visible:ring-2 focus-visible:ring-[#19b3b1]" />
                            <Button type="submit" disabled={!barcode.trim()} className="h-11 shrink-0 rounded-lg bg-[#19b3b1] px-3 text-white hover:bg-[#149d9b]" aria-label="ทดลองตรวจรหัส"><Barcode className="size-4" /></Button>
                          </div>
                        </form>
                        <Button type="button" variant="outline" onClick={handleMockScan} className="h-10 w-full rounded-lg border-[#b9dddb] bg-white text-sm font-semibold text-[#087f7d] hover:bg-[#e9f7f6]">
                          <ScanLine className="mr-2 size-4" />จำลองสแกนรายการถัดไป
                        </Button>
                        {scanMessage ? (
                          <div role="status" aria-live="polite" className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-5 ${scanMessage.kind === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
                            {scanMessage.kind === "success" ? <Check className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
                            <span>{scanMessage.text}</span>
                          </div>
                        ) : null}
                        <p className="text-xs leading-5 text-slate-500">{allScanned ? "ตรวจครบแล้ว พร้อมจบการจัดสินค้า" : `เหลืออีก ${requestedTotal - scannedTotal} หน่วย ตรวจให้ครบก่อนกดเสร็จสิ้น`}</p>
                        <Button type="button" onClick={handleComplete} disabled={!allScanned} className="h-11 w-full rounded-lg bg-[#e32329] font-semibold text-white hover:bg-[#c91e24] disabled:bg-slate-200 disabled:text-slate-500">
                          <CheckCheck className="mr-2 size-4" />เตรียมสินค้าเสร็จสิ้น
                        </Button>
                      </div>
                    ) : null}

                    {isCompleted ? (
                      <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-emerald-800"><CheckCheck className="size-4" />จบการจำลองแล้ว</p>
                        <p className="mt-1 text-xs leading-5 text-emerald-800/80">ผลอยู่ในเบราว์เซอร์นี้ ไม่ได้ส่งหรือเปลี่ยนสถานะในหลังบ้าน</p>
                      </div>
                    ) : null}

                    {order.status !== "preparing" ? (
                      <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">ออเดอร์ถูกเปลี่ยนสถานะเป็น “{order.status}” แล้ว จึงเริ่มหรือจบ Mock ไม่ได้</div>
                    ) : null}
                    {error && order ? <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div> : null}
                    {mockProgress.started || mockProgress.completed ? (
                      <Button type="button" variant="ghost" onClick={handleResetMock} className="mt-3 h-9 w-full rounded-lg text-xs text-slate-500 hover:bg-slate-50 hover:text-[#183130]">รีเซ็ตข้อมูลจำลอง</Button>
                    ) : null}
                  </div>
                </section>
              </aside>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
