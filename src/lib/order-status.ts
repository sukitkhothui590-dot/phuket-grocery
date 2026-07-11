import type { Order, OrderStatus } from "@/types";

export type OrderStatusGroup =
  | "all"
  | "active"
  | "waiting"
  | "completed"
  | "cancelled";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    shortLabel: string;
    description: string;
    colorClass: string;
  }
> = {
  pending_payment: {
    label: "รอชำระเงิน",
    shortLabel: "รอชำระ",
    description: "คำสั่งซื้อถูกสร้างแล้วและกำลังรอการชำระเงินจากลูกค้า",
    colorClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  pending_verify: {
    label: "รอตรวจสอบสลิป",
    shortLabel: "รอตรวจสอบ",
    description: "ระบบได้รับหลักฐานการโอนแล้วและกำลังรอตรวจสอบ",
    colorClass: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  },
  preparing: {
    label: "กำลังจัดเตรียมสินค้า",
    shortLabel: "กำลังจัดสินค้า",
    description: "ร้านค้ากำลังหยิบสินค้า แพ็กสินค้า และเตรียมส่ง",
    colorClass: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  },
  shipped: {
    label: "รอรับสินค้า",
    shortLabel: "รอรับสินค้า",
    description: "สินค้าถูกส่งออกแล้วและกำลังอยู่ระหว่างการจัดส่ง",
    colorClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  delivered: {
    label: "รับสินค้าแล้ว",
    shortLabel: "สำเร็จ",
    description: "คำสั่งซื้อถูกจัดส่งสำเร็จเรียบร้อยแล้ว",
    colorClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  cancelled: {
    label: "ยกเลิกคำสั่งซื้อ",
    shortLabel: "ยกเลิก",
    description: "คำสั่งซื้อถูกยกเลิกและไม่มีการจัดส่งต่อ",
    colorClass: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending_payment",
  "pending_verify",
  "preparing",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_GROUPS: Array<{
  value: OrderStatusGroup;
  label: string;
  description: string;
}> = [
  {
    value: "all",
    label: "ทั้งหมด",
    description: "ดูคำสั่งซื้อทั้งหมดทุกสถานะ",
  },
  {
    value: "active",
    label: "สั่งสินค้า",
    description: "คำสั่งซื้อที่ยังอยู่ระหว่างดำเนินการ",
  },
  {
    value: "waiting",
    label: "รอสินค้า",
    description: "สินค้าที่ส่งออกแล้วและกำลังรอรับ",
  },
  {
    value: "completed",
    label: "สำเร็จ",
    description: "คำสั่งซื้อที่รับสินค้าเรียบร้อยแล้ว",
  },
  {
    value: "cancelled",
    label: "ยกเลิก",
    description: "คำสั่งซื้อที่ถูกยกเลิก",
  },
];

export function matchesOrderGroup(order: Order, group: OrderStatusGroup) {
  switch (group) {
    case "all":
      return true;
    case "active":
      return ["pending_payment", "pending_verify", "preparing"].includes(
        order.status
      );
    case "waiting":
      return order.status === "shipped";
    case "completed":
      return order.status === "delivered";
    case "cancelled":
      return order.status === "cancelled";
    default:
      return false;
  }
}
