"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product, Category } from "@/types";

interface CategoryProductSectionProps {
  category: Category;
  products: Product[];
}

export function CategoryProductSection({
  category,
  products,
}: CategoryProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(() => updateScrollState());
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [products.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const amount = card
      ? (card.offsetWidth + 20) * 2
      : el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-4">
      <div className="flex flex-col overflow-hidden rounded-lg border lg:flex-row">
        {/* Sidebar - compact horizontal bar on mobile, full sidebar on desktop */}
        <div className="flex w-full items-center justify-between bg-slate-800 px-4 py-3 text-white lg:w-[220px] lg:flex-shrink-0 lg:flex-col lg:items-start lg:justify-between lg:p-5">
          <div className="lg:w-full">
            <h3 className="text-base font-bold lg:text-lg">{category.name}</h3>
            <ul className="mt-3 hidden space-y-1.5 lg:block">
              {category.subcategories.slice(0, 5).map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/categories/${category.slug}?sub=${sub.slug}`}
                    className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/categories/${category.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary/50 transition-colors hover:text-white lg:mt-4"
          >
            ดูทั้งหมด
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Product scroll area */}
        <div className="relative min-w-0 flex-1 overflow-hidden bg-white p-4">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="ย้อนกลับ"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-[180px] flex-shrink-0 sm:w-[200px] lg:w-[190px] xl:w-[195px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="ถัดไป"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
