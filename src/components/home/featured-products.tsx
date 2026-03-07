"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const PAGE_SIZE = 10;

export function FeaturedProducts({
  title,
  products,
  viewAllLink = "/categories",
}: FeaturedProductsProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const currentProducts = products.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">
              สินค้าขายดี คัดมาเพื่อร้านค้าของคุณ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-slate-600 transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border bg-white text-slate-600 transition-colors hover:bg-muted disabled:opacity-30 disabled:hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            ดูทั้งหมด
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
