import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Receipt,
  Truck,
  Zap,
} from "lucide-react";
import { getSystemFees } from "@/lib/fees";

export async function HomeFeesSummary() {
  const fees = await getSystemFees();

  const items = [
    {
      icon: Truck,
      title: "ค่าส่งมาตรฐาน",
      value: `฿${fees.shippingStandard.toLocaleString()}`,
      hint: "1–2 วันทำการ",
    },
    {
      icon: Zap,
      title: "ค่าส่งด่วน",
      value: `฿${fees.shippingExpress.toLocaleString()}`,
      hint: "วันนี้–พรุ่งนี้",
    },
    {
      icon: Receipt,
      title: "ส่งฟรีเมื่อครบ",
      value: `฿${fees.freeShippingThreshold.toLocaleString()}`,
      hint: "ยอดสั่งซื้อขั้นต่ำ",
    },
    {
      icon: Banknote,
      title: "ค่าธรรมเนียม COD",
      value:
        fees.codFee > 0 ? `฿${fees.codFee.toLocaleString()}` : "ไม่มี",
      hint: "เก็บเงินปลายทาง",
    },
  ];

  return (
    <section className="border-y bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                ค่าใช้จ่ายตอนสั่งซื้อ
              </h2>
              <p className="text-xs text-muted-foreground">
                ค่าส่ง COD และเงื่อนไขส่งฟรี ก่อนกดสั่ง
              </p>
            </div>
          </div>

          <Link
            href="/fees"
            className="flex items-center gap-1 self-end text-sm font-medium text-primary hover:underline sm:self-auto"
          >
            ดูรายละเอียด
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={item.title}
              className={`flex items-center gap-4 px-4 py-4 sm:px-6 ${
                idx < items.length - 1 ? "lg:border-r lg:border-slate-200" : ""
              }`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-base font-bold text-primary">
                  {item.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
