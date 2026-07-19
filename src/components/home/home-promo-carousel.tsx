"use client";

import { PackageOpen } from "lucide-react";
import { PromoCarouselCard } from "@/components/product/promo-carousel-card";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";

interface HomePromoCarouselProps {
  products: Product[];
}

const CARD_WIDTH_CLASS =
  "w-[48%] flex-shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[calc((100%-5rem)/5)]";

/**
 * Homepage "ดีลพิเศษ" block.
 * Products must already come from `GET /products?onSale=true` — do not re-filter
 * or load from `/campaigns/active`. Display prices as returned by the backend.
 */
export function HomePromoCarousel({ products }: HomePromoCarouselProps) {
  if (products.length === 0) {
    return (
      <section
        id="promotions"
        className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8"
      >
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-12 text-center">
          <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-3 text-lg font-bold text-foreground">ดีลพิเศษ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ยังไม่มีสินค้าลดราคาในตอนนี้ กลับมาดูใหม่ภายหลัง
          </p>
        </div>
      </section>
    );
  }

  return (
    <ProductCarousel
      id="promotions"
      title="ดีลพิเศษ"
      subtitle="สินค้าราคาพิเศษจากร้านและโปรโมชันที่กำลังจัด"
      viewAllHref="/deals"
      viewAllLabel="ดูทั้งหมด"
      visibleCount={5}
      showCountdown
    >
      {products.map((product) => (
        <div key={product.id} className={CARD_WIDTH_CLASS}>
          <PromoCarouselCard product={product} />
        </div>
      ))}
    </ProductCarousel>
  );
}
