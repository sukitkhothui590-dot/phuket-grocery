"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { addToCart } from "@/lib/cart-actions";
import { getBestPromoUnit, getPromoDetails } from "@/lib/product-promo";
import { ProductRating } from "@/components/product/product-rating";

interface PromoCarouselCardProps {
  product: Product;
}

export function PromoCarouselCard({ product }: PromoCarouselCardProps) {
  const [added, setAdded] = useState(false);
  const unit = getBestPromoUnit(product) ?? product.units[0];

  if (!unit) return null;

  const hasDiscount =
    !!unit.compareAtPrice && unit.compareAtPrice > unit.price;
  const { originalPrice, salePrice, savedAmount, discountPercent } =
    getPromoDetails(unit);

  const pieceUnit = product.units[0];
  const pricePerPiece =
    unit.conversionRate > 1
      ? Math.round((salePrice / unit.conversionRate) * 100) / 100
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      selectedUnit: unit,
      quantity: 1,
      sourceLabel: "ดีลพิเศษ",
      promoDiscountPercent: hasDiscount ? discountPercent : undefined,
      promoSavedAmount: hasDiscount ? savedAmount : undefined,
      dealId: unit.dealId ?? product.activeDeal?.id,
      dealBadge: product.activeDeal?.badge ?? product.activeDeal?.title,
      dealTitle: product.activeDeal?.title,
      dealSlug: product.activeDeal?.slug,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      <div className="absolute left-3 top-0 z-20 flex flex-col gap-1">
        {hasDiscount && discountPercent > 0 && (
          <div className="flex items-center gap-1 rounded-b-lg bg-gradient-to-br from-destructive to-red-600 px-2.5 py-1.5 text-white shadow-lg shadow-destructive/35">
            <span className="text-[10px] font-medium leading-none">ลด</span>
            <span className="text-sm font-extrabold leading-none">
              {discountPercent}%
            </span>
          </div>
        )}
        {product.activeDeal ? (
          <Link
            href={`/campaigns/${product.activeDeal.slug}`}
            onClick={(event) => event.stopPropagation()}
            className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {product.activeDeal.badge ?? product.activeDeal.title ?? "ดีลพิเศษ"}
          </Link>
        ) : (
          hasDiscount && (
            <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
              ดีลพิเศษ
            </span>
          )
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-t-xl bg-muted"
      >
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm ring-1 ring-border backdrop-blur-sm">
          {unit.labelTh}
        </span>

        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 rounded-b-xl p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <ProductRating
          rating={product.averageRating}
          count={product.reviewCount}
        />

        <div className="mt-1 flex items-end gap-2">
          <div className="flex items-baseline gap-0.5 text-destructive">
            <span className="text-lg font-bold leading-none">฿</span>
            <span className="text-[32px] font-extrabold leading-none tracking-tight">
              {salePrice.toLocaleString()}
            </span>
          </div>
          {hasDiscount && (
            <span className="mb-1 text-sm text-muted-foreground line-through">
              ฿{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hasDiscount && savedAmount > 0 && (
            <span className="inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-destructive ring-1 ring-destructive/10">
              ประหยัด ฿{savedAmount.toLocaleString()}
            </span>
          )}
          {pricePerPiece && (
            <span className="truncate text-[11px] text-muted-foreground">
              ฿{pricePerPiece.toLocaleString()}/{pieceUnit.labelTh}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
            added
              ? "bg-green-600 shadow-green-600/30"
              : "bg-primary shadow-primary/30 hover:bg-primary/90"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              เพิ่มแล้ว
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
              ซื้อเลย
            </>
          )}
        </button>
      </div>
    </article>
  );
}
