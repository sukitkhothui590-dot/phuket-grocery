"use client";

import { Clock3, MapPin, Phone, Truck } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { Order } from "@/types";

type DeliveryTrackerProps = {
  order: Order;
};

function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function formatAddress(order: Order) {
  return [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.subDistrict,
    order.shippingAddress.district,
    order.shippingAddress.province,
    order.shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function getEtaMinutes(order: Order) {
  if (order.status === "shipped") {
    return order.shippingMethod === "express" ? 18 : 32;
  }

  return order.shippingMethod === "express" ? 50 : 95;
}

function getEtaRange(order: Order) {
  if (order.status === "shipped") {
    return order.shippingMethod === "express" ? "10-20 นาที" : "20-35 นาที";
  }

  return order.shippingMethod === "express" ? "40-60 นาที" : "75-120 นาที";
}

function getEtaDate(order: Order) {
  const baseTime = new Date(order.updatedAt || order.createdAt).getTime();
  return new Date(baseTime + getEtaMinutes(order) * 60 * 1000);
}

function formatEtaClock(order: Order) {
  return getEtaDate(order).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEtaDescription(order: Order) {
  if (order.status === "shipped") {
    return "พนักงานจัดส่งกำลังนำสินค้าไปยังปลายทางของคุณ";
  }

  return "ร้านค้ากำลังแพ็กสินค้าและเตรียมคิวจัดส่งออกจากสาขา";
}

function getStatusLabel(order: Order) {
  return order.status === "shipped" ? "กำลังจัดส่ง" : "กำลังเตรียมจัดส่ง";
}

export function OrderDeliveryTracker({ order }: DeliveryTrackerProps) {
  const etaRange = getEtaRange(order);
  const etaClock = formatEtaClock(order);
  const statusLabel = getStatusLabel(order);
  const storePhone = COMPANY_INFO.phone;

  return (
    <section className="rounded-2xl border bg-white">
      <div className="flex flex-col gap-4 border-b px-5 py-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Delivery Status</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{statusLabel}</h2>
          <p className="mt-2 text-sm text-slate-500">{getEtaDescription(order)}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {statusLabel}
          </span>
          <a
            href={toTelHref(storePhone)}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            ติดต่อร้านค้า
          </a>
        </div>
      </div>

      <div className="grid gap-4 px-5 py-5 lg:grid-cols-3">
        <div className="rounded-xl border bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-2 text-primary">
            <Clock3 className="h-4 w-4" />
            <p className="text-sm font-semibold">เวลาจัดส่งโดยประมาณ</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-foreground">{etaRange}</p>
          <p className="mt-2 text-sm text-slate-500">คาดว่าจะถึงประมาณ {etaClock} น.</p>
        </div>

        <div className="rounded-xl border bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-2 text-primary">
            <Truck className="h-4 w-4" />
            <p className="text-sm font-semibold">รูปแบบการจัดส่ง</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {order.shippingMethod === "express" ? "จัดส่งด่วน" : "จัดส่งมาตรฐาน"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            อัปเดตล่าสุด {new Date(order.updatedAt).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            น.
          </p>
        </div>

        <div className="rounded-xl border bg-slate-50 px-4 py-4">
          <div className="flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            <p className="text-sm font-semibold">ปลายทางจัดส่ง</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {order.shippingAddress.fullName}
          </p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
            {formatAddress(order)}
          </p>
        </div>
      </div>

      <div className="border-t px-5 py-4">
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="font-medium text-foreground">ออกจาก</p>
            <p className="mt-1">ศูนย์กระจายสินค้า Phuket Grocery</p>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <span className="h-px w-12 bg-slate-200" />
          </div>
          <div className="md:text-right">
            <p className="font-medium text-foreground">ปลายทาง</p>
            <p className="mt-1">
              {order.shippingAddress.subDistrict}, {order.shippingAddress.district},{" "}
              {order.shippingAddress.province} {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4 text-sm">
          <span className="text-slate-500">เลขคำสั่งซื้อ</span>
          <span className="font-medium text-foreground">{order.orderNumber}</span>
        </div>
      </div>
    </section>
  );
}
