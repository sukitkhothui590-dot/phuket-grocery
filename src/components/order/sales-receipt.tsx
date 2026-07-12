import {
  COMPANY_INFO,
  FREE_SHIPPING_THRESHOLD,
  SITE_NAME,
  SITE_NAME_EN,
} from "@/lib/constants";
import type { Order } from "@/types";

function formatMoney(value: number) {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    .join(" ");
}

function paymentLabel(method: Order["paymentMethod"]) {
  return method === "bank_transfer" ? "โอนผ่านธนาคาร" : "COD / เก็บเงินปลายทาง";
}

function shippingLabel(method: Order["shippingMethod"]) {
  return method === "express" ? "จัดส่งด่วน" : "จัดส่งปกติ";
}

function unitPrice(item: Order["items"][number]) {
  if (item.quantity <= 0) return 0;
  return item.selectedUnit.price ?? item.subtotal / item.quantity;
}

function thaiBahtText(amount: number): string {
  const ones = [
    "",
    "หนึ่ง",
    "สอง",
    "สาม",
    "สี่",
    "ห้า",
    "หก",
    "เจ็ด",
    "แปด",
    "เก้า",
  ];
  const positions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  const round = Math.round(amount * 100);
  const baht = Math.floor(round / 100);
  const satang = round % 100;

  function readGroup(n: number): string {
    if (n === 0) return "";
    let s = "";
    const digits = String(n).split("").map(Number);
    const len = digits.length;
    digits.forEach((d, i) => {
      const pos = len - i - 1;
      if (d === 0) return;
      if (pos === 1 && d === 1) s += "สิบ";
      else if (pos === 1 && d === 2) s += "ยี่สิบ";
      else if (pos === 0 && d === 1 && len > 1) s += "เอ็ด";
      else s += ones[d] + positions[pos];
    });
    return s;
  }

  function readNumber(n: number): string {
    if (n === 0) return "ศูนย์";
    if (n < 1_000_000) return readGroup(n);
    const millions = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    return `${readGroup(millions)}ล้าน${rest ? readGroup(rest) : ""}`;
  }

  let text = `${readNumber(baht)}บาท`;
  text += satang === 0 ? "ถ้วน" : `${readNumber(satang)}สตางค์`;
  return text;
}

type SalesReceiptProps = {
  order: Order;
};

export function SalesReceipt({ order }: SalesReceiptProps) {
  const paymentFee =
    order.paymentFee ??
    (order.paymentMethod === "cod"
      ? Math.max(
          0,
          Math.round(
            (order.total -
              (order.subtotal - order.discount + order.shippingCost)) *
              100,
          ) / 100,
        )
      : 0);

  return (
    <article className="print-receipt flex min-h-[720px] flex-col border border-neutral-800 bg-white text-neutral-900 shadow-sm print:min-h-[281mm] print:border-black print:shadow-none">
      <header className="shrink-0 border-b-2 border-neutral-900 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden border border-neutral-300">
              <img
                src="/images/logo.png"
                alt={SITE_NAME}
                className="h-full w-full scale-[1.12] object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight">
                {COMPANY_INFO.shortName}
              </p>
              <p className="text-xs text-neutral-600">{SITE_NAME_EN}</p>
              <p className="mt-1 text-[11px] leading-4 text-neutral-700">
                {COMPANY_INFO.address}
              </p>
              <p className="mt-0.5 text-[11px] text-neutral-700">
                Tel {COMPANY_INFO.phone} · {COMPANY_INFO.email}
              </p>
              <p className="text-[11px] text-neutral-700">
                Tax ID {COMPANY_INFO.registrationNo}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <h1 className="text-lg font-bold uppercase leading-tight tracking-wide">
              Official Receipt
            </h1>
            <p className="text-sm font-semibold">ใบเสร็จรับเงิน</p>
            <dl className="mt-2 space-y-1 text-[11px]">
              <div className="flex justify-end gap-2">
                <dt className="text-neutral-500">No.</dt>
                <dd className="font-semibold">{order.orderNumber}</dd>
              </div>
              <div className="flex justify-end gap-2">
                <dt className="text-neutral-500">Date</dt>
                <dd>{formatDateTime(order.createdAt)}</dd>
              </div>
              <div className="flex justify-end gap-2">
                <dt className="text-neutral-500">Curr.</dt>
                <dd>THB</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <section className="grid shrink-0 grid-cols-2 border-b border-neutral-300 text-[11px]">
        <div className="border-r border-neutral-300 px-4 py-3 sm:px-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
            Bill To / ผู้ซื้อ
          </p>
          <p className="mt-1 text-sm font-semibold">
            {order.shippingAddress.fullName}
          </p>
          <p className="mt-0.5 text-neutral-700">
            Tel {order.shippingAddress.phone}
          </p>
          <p className="mt-1 leading-4 text-neutral-700">
            {formatAddress(order)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Payment
            </p>
            <p className="mt-0.5 font-medium">
              {paymentLabel(order.paymentMethod)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Delivery
            </p>
            <p className="mt-0.5 font-medium">
              {shippingLabel(order.shippingMethod)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Items
            </p>
            <p className="mt-0.5 font-medium">
              {order.items.length} รายการ ·{" "}
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น
            </p>
          </div>
        </div>
      </section>

      {/* Growing items area fills remaining page height */}
      <section className="receipt-items flex min-h-0 flex-1 flex-col">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-neutral-900 bg-neutral-100 text-left">
              <th className="w-8 px-3 py-2 font-semibold">#</th>
              <th className="px-2 py-2 font-semibold">รายการ</th>
              <th className="w-16 px-2 py-2 font-semibold">หน่วย</th>
              <th className="w-12 px-2 py-2 text-right font-semibold">Qty</th>
              <th className="w-20 px-2 py-2 text-right font-semibold">ราคา</th>
              <th className="w-24 px-3 py-2 text-right font-semibold">รวม</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr
                key={
                  item.id ??
                  `${item.productId}-${item.selectedUnit.sku}-${index}`
                }
                className="border-b border-neutral-200"
              >
                <td className="px-3 py-2.5 text-neutral-600">{index + 1}</td>
                <td className="px-2 py-2.5 font-medium">{item.productName}</td>
                <td className="px-2 py-2.5 text-neutral-700">
                  {item.selectedUnit.labelTh}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums">
                  {formatMoney(unitPrice(item))}
                </td>
                <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                  {formatMoney(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="receipt-items-spacer min-h-[48px] flex-1 border-b border-neutral-200" />
      </section>

      <section className="grid shrink-0 grid-cols-[1.1fr_0.9fr] border-b border-neutral-300">
        <div className="border-r border-neutral-300 px-4 py-3 sm:px-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
            จำนวนเงินตัวอักษร
          </p>
          <p className="mt-1 text-sm font-semibold leading-5">
            {thaiBahtText(order.total)}
          </p>
          <p className="mt-2 text-[10px] leading-4 text-neutral-500">
            ราคารวม VAT 7%
            {order.shippingCost === 0
              ? ` · ส่งฟรีเมื่อยอดครบ ฿${FREE_SHIPPING_THRESHOLD.toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="px-4 py-3 sm:px-5">
          <dl className="space-y-1 text-[12px]">
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-600">ยอดสินค้า</dt>
              <dd className="tabular-nums">{formatMoney(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between gap-2">
                <dt className="text-neutral-600">
                  ส่วนลด{order.couponCode ? ` (${order.couponCode})` : ""}
                </dt>
                <dd className="tabular-nums">
                  -{formatMoney(order.discount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <dt className="text-neutral-600">ค่าจัดส่ง</dt>
              <dd className="tabular-nums">
                {order.shippingCost === 0
                  ? "0.00"
                  : formatMoney(order.shippingCost)}
              </dd>
            </div>
            {paymentFee > 0 && (
              <div className="flex justify-between gap-2">
                <dt className="text-neutral-600">ค่าธรรมเนียม COD</dt>
                <dd className="tabular-nums">{formatMoney(paymentFee)}</dd>
              </div>
            )}
            <div className="mt-2 flex justify-between gap-2 border-t-2 border-neutral-900 pt-2 text-sm font-bold">
              <dt>รวมทั้งสิ้น</dt>
              <dd className="tabular-nums">{formatMoney(order.total)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid shrink-0 grid-cols-[1.2fr_1fr] gap-4 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
            รับเงินแล้ว
          </p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-700">
            ได้รับเงินจำนวน{" "}
            <span className="font-semibold">
              {formatMoney(order.total)} บาท
            </span>{" "}
            สำหรับรายการตามใบเสร็จนี้
            {order.paymentMethod === "cod" ? " (ชำระเมื่อรับสินค้า / COD)" : ""}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="mx-auto mb-1.5 h-12 w-full border-b border-neutral-400" />
            <p className="text-[10px] font-semibold">ผู้ขาย</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-1.5 h-12 w-full border-b border-neutral-400" />
            <p className="text-[10px] font-semibold">ผู้รับ</p>
          </div>
        </div>
      </section>

      <footer className="mt-auto shrink-0 border-t border-neutral-300 px-4 py-2 text-center text-[10px] leading-4 text-neutral-500 sm:px-5">
        เอกสารอิเล็กทรอนิกส์ · ขอบคุณที่ใช้บริการ {SITE_NAME}
      </footer>
    </article>
  );
}
