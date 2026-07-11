import Link from "next/link";
import {
  Banknote,
  CircleMinus,
  Package,
  Receipt,
  Truck,
  Zap,
} from "lucide-react";
import { getSystemFees } from "@/lib/fees";

const ICONS = {
  product: Package,
  shipping_standard: Truck,
  shipping_express: Zap,
  cod: Banknote,
  discount: CircleMinus,
} as const;

export default async function FeesPage() {
  const fees = await getSystemFees();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Receipt className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">
            ค่าใช้จ่ายตอนสั่งซื้อ
          </h1>
          <p className="text-xs text-muted-foreground">
            รายการที่ระบบอาจคิดเงิน — ค่าส่ง COD และส่วนลดคูปอง
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg border bg-white p-3 text-center sm:p-4">
          <p className="text-[11px] text-muted-foreground">ค่าส่งมาตรฐาน</p>
          <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
            ฿{fees.shippingStandard.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center sm:p-4">
          <p className="text-[11px] text-muted-foreground">ค่าส่งด่วน</p>
          <p className="mt-1 text-lg font-bold text-foreground sm:text-xl">
            ฿{fees.shippingExpress.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-3 text-center sm:p-4">
          <p className="text-[11px] text-muted-foreground">ส่งฟรีเมื่อครบ</p>
          <p className="mt-1 text-lg font-bold text-primary sm:text-xl">
            ฿{fees.freeShippingThreshold.toLocaleString()}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        {fees.items.map((item) => {
          const Icon = ICONS[item.id];
          return (
            <article
              key={item.id}
              className="rounded-lg border bg-white p-4"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <span
                      className={`text-sm font-bold ${
                        item.isCharge ? "text-foreground" : "text-primary"
                      }`}
                    >
                      {item.amountLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  {item.condition && (
                    <p className="mt-2 text-[11px] text-slate-500">
                      {item.condition}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-6 rounded-lg border border-dashed bg-slate-50 px-4 py-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">สรุปตอนคิดเงิน</p>
        <p className="mt-1 text-xs leading-6">
          ยอดชำระ = ราคาสินค้า + ค่าจัดส่ง
          {fees.codFee > 0 ? " + ค่าธรรมเนียม COD (ถ้าเลือก)" : ""} − ส่วนลดคูปอง
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/coupons"
            className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
          >
            ดูคูปองส่วนลด
          </Link>
          <Link
            href="/categories"
            className="rounded-md border px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5"
          >
            เลือกซื้อสินค้า
          </Link>
        </div>
      </div>
    </main>
  );
}
