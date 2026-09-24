"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductRating } from "@/components/product/product-rating";
import type { Product, ProductUnit } from "@/types";
import { addToCart } from "@/lib/cart-actions";
import {
  getDisplayUnit,
  getPromoDetails,
  getUnitDisplayLabel,
  sortProductUnits,
} from "@/lib/product-promo";

interface ProductCardProps {
  product: Product;
  listingUnit?: ProductUnit;
  unitLabelFilter?: string;
  /**
   * Cart provenance label. Special Deal surfaces (`/deals`) should pass
   * `"ดีลพิเศษ"` so campaign-priced items still read as store sale deals.
   */
  sourceLabel?: string;
}

export function ProductCard({ product, sourceLabel, listingUnit, unitLabelFilter }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const visibleUnits = listingUnit
    ? [listingUnit]
    : unitLabelFilter
    ? product.units.filter((unit) => getUnitDisplayLabel(unit) === unitLabelFilter)
    : product.units;
  const displayUnit = listingUnit ?? (unitLabelFilter
    ? visibleUnits.find((unit) => unit.stock > 0) ?? visibleUnits[0]
    : getDisplayUnit(product));
  const [selectedSku, setSelectedSku] = useState(
    () => displayUnit?.sku ?? "",
  );
  const selectedUnit: ProductUnit | undefined =
    visibleUnits.find((unit) => unit.sku === selectedSku) ?? displayUnit;

  if (!displayUnit || !selectedUnit) return null;

  const hasDiscount =
    !!selectedUnit.compareAtPrice &&
    selectedUnit.compareAtPrice > selectedUnit.price;
  const { discountPercent, savedAmount } = getPromoDetails(selectedUnit);
  const cartSourceLabel =
    sourceLabel ??
    (hasDiscount || product.activeDeal ? "ดีลพิเศษ" : undefined);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedUnit.stock <= 0) {
      window.alert("สินค้าหมดสต็อก");
      return;
    }
    const result = await addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      selectedUnit,
      quantity: 1,
      dealId: selectedUnit.dealId ?? product.activeDeal?.id,
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
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
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

        {visibleUnits.length > 1 && (
          <div className="mt-2 grid grid-cols-2 gap-1.5" aria-label="เลือกหน่วยขาย">
            {sortProductUnits(visibleUnits).map((unit) => {
              const isSelected = unit.sku === selectedUnit.sku;
              return (
                <button
                  key={unit.sku}
                  type="button"
                  disabled={unit.stock <= 0}
                  aria-pressed={isSelected}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedSku(unit.sku);
                    setAdded(false);
                  }}
                  className={`min-w-0 rounded-md border px-2 py-1.5 text-left text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="block truncate font-medium">
                    {getUnitDisplayLabel(unit)}
                  </span>
                  <span className="mt-0.5 block font-semibold">
                    ฿{unit.price.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto flex items-end gap-2 pt-2">
          <div className="flex items-baseline gap-0.5 text-primary">
            <span className="text-base font-bold leading-none">฿</span>
            <span className="text-[28px] font-extrabold leading-none tracking-tight">
              {selectedUnit.price.toLocaleString()}
            </span>
          </div>
          {hasDiscount && (
            <span className="mb-0.5 text-sm text-muted-foreground line-through">
              ฿{selectedUnit.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          ราคาต่อ {getUnitDisplayLabel(selectedUnit)}
        </p>

        <button
          type="button"
          data-testid="add-to-cart"
          onClick={handleAddToCart}
          disabled={selectedUnit.stock <= 0}
          className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 ${
            added
              ? "bg-green-600 hover:bg-green-600"
              : "bg-primary hover:bg-primary/90"
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
              {selectedUnit.stock <= 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
