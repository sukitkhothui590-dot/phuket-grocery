"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { getPlaceholderUrl } from "@/lib/placeholder";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const lowestUnit = product.units[0];

  const hasDiscount =
    lowestUnit.compareAtPrice && lowestUnit.compareAtPrice > lowestUnit.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((lowestUnit.compareAtPrice! - lowestUnit.price) /
          lowestUnit.compareAtPrice!) *
          100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? "",
      selectedUnit: lowestUnit,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg"
    >
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <Badge className="bg-red-500 text-white hover:bg-red-500">
            -{discountPercent}%
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-green-500 text-white hover:bg-green-500">
            ใหม่
          </Badge>
        )}
      </div>

      {/* Quick actions on hover */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-primary hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={getPlaceholderUrl(300, 300)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-primary/90 py-2 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5"
          >
            <ShoppingCart className="h-4 w-4" />
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          {lowestUnit.labelTh}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-primary">
            ฿{lowestUnit.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ฿{lowestUnit.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        {product.units.length > 1 && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            มี {product.units.length} หน่วยนับ
          </p>
        )}
      </div>
    </Link>
  );
}
