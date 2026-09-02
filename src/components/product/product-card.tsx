"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductRating } from "@/components/product/product-rating";
import type { Product } from "@/types";
import { addToCart } from "@/lib/cart-actions";
import { getDisplayUnit, getPromoDetails } from "@/lib/product-promo";

interface ProductCardProps {
  product: Product;
  /**
   * Cart provenance label. Special Deal surfaces (`/deals`) should pass
   * `"ดีลพิเศษ"` so campaign-priced items still read as store sale deals.
   */
  sourceLabel?: string;
}

export function ProductCard({ product, sourceLabel }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const displayUnit = getDisplayUnit(product);

  if (!displayUnit) return null;

  const outOfStock = displayUnit.stock <= 0;

  const hasDiscount =
    !!displayUnit.compareAtPrice &&
    displayUnit.compareAtPrice > displayUnit.price;
  const { discountPercent, savedAmount } = getPromoDetails(displayUnit);
  const cartSourceLabel =
    sourceLabel ??
    (hasDiscount || product.activeDeal ? "ดีลพิเศษ" : undefined);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayUnit.stock <= 0) {
      window.alert("สินค้าหมดสต็อก");
      return;
    }
    const result = await addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      selectedUnit: displayUnit,
      quantity: 1,
      dealId: displayUnit.dealId ?? product.activeDeal?.id,
      dealBadge: product.activeDeal?.badge ?? product.activeDeal?.title,
      dealTitle: product.activeDeal?.title,
      dealSlug: product.activeDeal?.slug,
      sourceLabel: cartSourceLabel,
      promoDiscountPercent: hasDiscount ? discountPercent : undefined,
      promoSavedAmount: hasDiscount ? savedAmount : undefined,
    });
    if (!result.success) {
      if (!result.error.includes("เข้าสู่ระบบ")) {
        window.alert(result.error);
      }
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg">
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.activeDeal && (
          <Link
            href={`/campaigns/${product.activeDeal.slug}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Badge className="bg-primary text-white hover:bg-primary/90">
              {product.activeDeal.badge ?? product.activeDeal.title ?? "ดีลพิเศษ"}
            </Badge>
          </Link>
        )}
        {hasDiscount && discountPercent > 0 && (
          <Badge className="bg-red-500 text-white hover:bg-red-500">
            -{discountPercent}%
          </Badge>
        )}
        {!product.activeDeal && hasDiscount && (
          <Badge className="bg-primary text-white hover:bg-primary/90">
            ดีลพิเศษ
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-green-500 text-white hover:bg-green-500">
            ใหม่
          </Badge>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            outOfStock ? "opacity-45 grayscale" : ""
          }`}
        />
        {outOfStock && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-slate-900/70 py-1.5 text-center text-xs font-bold text-white">
            สินค้าหมด
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <ProductRating
          rating={product.averageRating}
          count={product.reviewCount}
          className="mt-1"
        />

        <p className="mt-1 text-xs text-muted-foreground">
          {displayUnit.labelTh}
        </p>

        <div className="mt-auto flex items-end gap-2 pt-2">
          <div className="flex items-baseline gap-0.5 text-primary">
            <span className="text-base font-bold leading-none">฿</span>
            <span className="text-[28px] font-extrabold leading-none tracking-tight">
              {displayUnit.price.toLocaleString()}
            </span>
          </div>
          {hasDiscount && (
            <span className="mb-0.5 text-sm text-muted-foreground line-through">
              ฿{displayUnit.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        {product.units.length > 1 && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            มี {product.units.length} หน่วยนับ
          </p>
        )}

        <button
          type="button"
          data-testid="add-to-cart"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-[0.98] ${
            outOfStock
              ? "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none active:scale-100"
              : added
                ? "bg-green-600 text-white hover:bg-green-600"
                : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          {outOfStock ? (
            "สินค้าหมด · รอสินค้าเข้า"
          ) : added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              เพิ่มแล้ว
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" strokeWidth={2.5} />
              เพิ่มลงตะกร้า
            </>
          )}
        </button>
      </div>
    </article>
  );
}
