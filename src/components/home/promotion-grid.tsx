import Link from "next/link";
import { getPlaceholderUrl } from "@/lib/placeholder";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  bgColor: string;
  textColor: string;
}

const promoBanners: PromoBanner[] = [
  {
    id: "pb-1",
    title: "ราคาส่ง ถูกกว่าแน่นอน",
    subtitle: "ซื้อยกลังประหยัดสูงสุด 30%",
    cta: "ช้อปเลย",
    link: "/categories",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    id: "pb-2",
    title: "สินค้าพร้อมส่ง ครบทุกหมวด",
    subtitle: "กว่า 1,000 รายการ จัดส่งทั่วภูเก็ต",
    cta: "ดูสินค้า",
    link: "/categories",
    bgColor: "bg-slate-800",
    textColor: "text-white",
  },
  {
    id: "pb-3",
    title: "สั่งครบ 1,500 ส่งฟรี!",
    subtitle: "จัดส่งรวดเร็ว 1-2 วันถึงหน้าร้าน",
    cta: "สั่งเลย",
    link: "/categories",
    bgColor: "bg-primary",
    textColor: "text-white",
  },
];

export function PromotionGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {promoBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={`group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-lg p-5 transition-shadow hover:shadow-lg sm:min-h-[180px] ${banner.bgColor} ${banner.textColor}`}
          >
            <div>
              <h3 className="text-lg font-bold leading-tight sm:text-xl">
                {banner.title}
              </h3>
              <p className="mt-1 text-sm opacity-80">{banner.subtitle}</p>
            </div>
            <span className="mt-3 inline-flex w-fit items-center rounded-md bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/30">
              {banner.cta} →
            </span>

            <img
              src={getPlaceholderUrl(160, 160, "Promo")}
              alt=""
              className="absolute -bottom-2 -right-2 h-28 w-28 rounded-md object-cover opacity-20 sm:h-32 sm:w-32"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
