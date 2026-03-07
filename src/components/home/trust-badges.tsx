import {
  Truck,
  CreditCard,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "จัดส่งรวดเร็ว",
    description: "ส่งทั่วภูเก็ต 1-2 วัน",
  },
  {
    icon: CreditCard,
    title: "ชำระเงินสะดวก",
    description: "โอนเงิน / เก็บเงินปลายทาง",
  },
  {
    icon: ShieldCheck,
    title: "สินค้าคุณภาพ",
    description: "รับประกันทุกชิ้น ของแท้ 100%",
  },
  {
    icon: Headphones,
    title: "บริการหลังขาย",
    description: "ทีมงานพร้อมดูแลตลอด",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y bg-slate-50 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-4 lg:grid-cols-4">
        {badges.map((badge, idx) => (
          <div
            key={badge.title}
            className={`flex items-center gap-4 px-6 py-4 ${idx < badges.length - 1 ? "lg:border-r lg:border-slate-200" : ""}`}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <badge.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {badge.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
