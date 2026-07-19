"use client";

import { PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  /** Forwarded to each card (e.g. `"ดีลพิเศษ"` on `/deals`). */
  sourceLabel?: string;
}

export function ProductGrid({ products, sourceLabel }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageOpen className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h3 className="text-lg font-medium text-foreground">
          ไม่พบสินค้า
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          sourceLabel={sourceLabel}
        />
      ))}
    </div>
  );
}
