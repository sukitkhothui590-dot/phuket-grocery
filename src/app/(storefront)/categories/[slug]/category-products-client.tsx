"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductGrid } from "@/components/product/product-grid";
import type { Category, Product } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryProductsClientProps {
  category: Category;
  products: Product[];
  currentSub: string;
  currentSearch: string;
  currentSort: string;
}

const SORT_OPTIONS = [
  { value: "default", label: "เรียงเริ่มต้น" },
  { value: "newest", label: "ใหม่ล่าสุด" },
  { value: "price-asc", label: "ราคาต่ำ → สูง" },
  { value: "price-desc", label: "ราคาสูง → ต่ำ" },
] as const;

export function CategoryProductsClient({
  category,
  products,
  currentSub,
  currentSearch,
  currentSort,
}: CategoryProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      }
      router.push(`/categories/${category.slug}?${params.toString()}`);
    },
    [router, searchParams, category.slug]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const handleSubcategoryClick = (subSlug: string) => {
    updateParams({ sub: currentSub === subSlug ? "" : subSlug });
    setMobileFilterOpen(false);
  };

  const handleSortChange = (value: string | null) => {
    if (!value || value === "default") {
      updateParams({ sort: "" });
      return;
    }
    updateParams({ sort: value });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push(`/categories/${category.slug}`);
  };

  const hasActiveFilters = currentSub || currentSearch || currentSort;

  const subcategoryList = (
    <nav className="space-y-1">
      <button
        onClick={() => handleSubcategoryClick("")}
        className={cn(
          "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
          !currentSub
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        ทั้งหมด
      </button>
      {category.subcategories.map((sub) => (
        <button
          key={sub.id}
          onClick={() => handleSubcategoryClick(sub.slug)}
          className={cn(
            "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
            currentSub === sub.slug
              ? "bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {sub.name}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/categories"
          className="transition-colors hover:text-primary"
        >
          หมวดหมู่
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{category.name}</span>
      </nav>

      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>

      {/* Search + Sort + Mobile filter toggle */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="h-9 pl-9 pr-9"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateParams({ search: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {/* Mobile filter button */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            ตัวกรอง
          </Button>

          <Select
            value={currentSort || "default"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[160px]" size="sm">
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              ล้างตัวกรอง
            </Button>
          )}
        </div>
      </div>

      {/* Mobile subcategory filter */}
      {mobileFilterOpen && (
        <div className="mb-5 rounded-lg border bg-white p-4 lg:hidden">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            หมวดหมู่ย่อย
          </h3>
          {subcategoryList}
        </div>
      )}

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-4 rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              หมวดหมู่ย่อย
            </h3>
            {subcategoryList}
          </div>
        </aside>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-sm text-muted-foreground">
            พบ {products.length} สินค้า
          </p>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
