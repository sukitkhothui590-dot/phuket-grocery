import Link from "next/link";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  image: string;
  bgClass: string;
  textClass: string;
}

const promoBanners: PromoBanner[] = [
  {
    id: "pb-1",
    title: "ราคาส่ง ถูกกว่าแน่นอน",
    subtitle: "ซื้อยกลังประหยัดสูงสุด 30%",
    cta: "ช้อปเลย",
    link: "/categories",
    image: "/promo/promo-1.png",
    bgClass: "bg-primary",
    textClass: "text-primary-foreground",
  },
  {
    id: "pb-2",
    title: "สินค้าพร้อมส่ง ครบทุกหมวด",
    subtitle: "กว่า 1,000 รายการ จัดส่งทั่วภูเก็ต",
    cta: "ดูสินค้า",
    link: "/categories",
    image: "/promo/promo-2.png",
    bgClass: "bg-slate-800",
    textClass: "text-white",
  },
  {
    id: "pb-3",
    title: "สั่งครบ 1,500 ส่งฟรี!",
    subtitle: "จัดส่งรวดเร็ว 1-2 วันถึงหน้าร้าน",
    cta: "สั่งเลย",
    link: "/categories",
    image: "/promo/promo-3.png",
    bgClass: "bg-primary",
    textClass: "text-white",
  },
];

export function PromotionGrid() {
  return (
    <section id="promotions" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {promoBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className={`group relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-lg border border-slate-200 p-5 transition-shadow hover:shadow-lg sm:min-h-[180px] ${banner.bgClass} ${banner.textClass}`}
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold leading-tight sm:text-xl">
                {banner.title}
              </h3>
              <p className="mt-1 max-w-[18rem] text-sm opacity-85">
                {banner.subtitle}
              </p>
            </div>

            <span className="relative z-10 mt-3 inline-flex w-fit items-center rounded-md bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/30">
              {banner.cta} →
            </span>

            <img
              src={banner.image}
              alt=""
              className="absolute -bottom-4 -right-4 h-40 w-40 rounded-md object-cover opacity-60 sm:h-48 sm:w-48"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
