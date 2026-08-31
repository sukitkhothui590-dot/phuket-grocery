"use client";

import Link from "next/link";
import { ProductSearchBar } from "@/components/product/product-search-bar";

interface CategoriesSearchSectionProps {
  query?: string;
  total?: number;
  showResultsHeading?: boolean;
}

export function CategoriesSearchSection({
  query = "",
  total,
  showResultsHeading = false,
}: CategoriesSearchSectionProps) {
  return (
    <div className="mb-6">
      <ProductSearchBar
        initialQuery={query}
        className="max-w-xl"
        inputClassName="h-10"
      />

      {showResultsHeading && query ? (
        <>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            ผลการค้นหา &ldquo;{query}&rdquo;
          </h1>
          {typeof total === "number" && (
            <p className="mt-1 text-sm text-muted-foreground">
              พบ {total.toLocaleString()} รายการ
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          ค้นหาสินค้าจากทุกหมวดหมู่ หรือ{" "}
          <Link href="/categories" className="text-primary hover:underline">
            ดูหมวดหมู่ทั้งหมด
          </Link>
        </p>
      )}
    </div>
  );
}
