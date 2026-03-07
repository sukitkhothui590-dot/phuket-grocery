import Link from "next/link";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { ArrowRight } from "lucide-react";

const banners = [
  {
    id: "bp-1",
    title: "ส่งฟรีทั่วภูเก็ต",
    subtitle: "สั่งครบ 1,500 บาท จัดส่งฟรีถึงหน้าร้าน",
    bgColor: "bg-primary",
    link: "/categories",
  },
  {
    id: "bp-2",
    title: "สมาชิกรับส่วนลดพิเศษ",
    subtitle: "สมัครสมาชิกวันนี้ ลดเพิ่มสูงสุด 15%",
    bgColor: "bg-gradient-to-br from-slate-800 to-slate-900",
    link: "/register",
  },
  {
    id: "bp-3",
    title: "ราคาส่งถูกกว่า",
    subtitle: "ซื้อยกลัง ยกแพ็ค ประหยัดจริง คุ้มกว่า",
    bgColor: "bg-gradient-to-br from-[#01A1AF] to-[#018490]",
    link: "/categories",
  },
];

export function BottomPromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.link}
            className={`group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-xl p-6 text-white transition-all hover:shadow-xl ${b.bgColor}`}
          >
            <div>
              <p className="text-lg font-bold">{b.title}</p>
              <p className="mt-1 text-sm text-white/70">{b.subtitle}</p>
            </div>
            <span className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-white/80 transition-colors group-hover:text-white">
              ดูเพิ่มเติม
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <img
              src={getPlaceholderUrl(120, 120)}
              alt=""
              className="absolute -bottom-2 -right-2 h-24 w-24 rounded-lg object-cover opacity-10"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
