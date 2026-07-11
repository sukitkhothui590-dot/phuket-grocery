"use client";

import { PromoCarouselCard } from "@/components/product/promo-carousel-card";
import { ProductCarousel } from "@/components/home/product-carousel";
import type { Product } from "@/types";

interface HomePromoCarouselProps {
  products: Product[];
}

const CARD_WIDTH_CLASS =
  "w-[48%] flex-shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[calc((100%-5rem)/5)]";

export function HomePromoCarousel({ products }: HomePromoCarouselProps) {
  const promoProducts = products.filter((product) =>
    product.units.some(
      (unit) => unit.compareAtPrice && unit.compareAtPrice > unit.price
    )
  );

  if (promoProducts.length === 0) return null;

  return (
    <ProductCarousel
      title="ดีลพิเศษ"
      viewAllHref="/categories"
      visibleCount={5}
      showCountdown
    >
      {promoProducts.map((product) => (
        <div key={product.id} className={CARD_WIDTH_CLASS}>
          <PromoCarouselCard product={product} />
        </div>
      ))}
    </ProductCarousel>
  );
}
