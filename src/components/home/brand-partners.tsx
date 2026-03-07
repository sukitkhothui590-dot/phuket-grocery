"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPlaceholderUrl } from "@/lib/placeholder";

const brands = Array.from({ length: 12 }, (_, i) => ({
  id: `brand-${i + 1}`,
  name: "xxx",
}));

export function BrandPartners() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            แบรนด์ที่เข้าร่วมกับเรา
          </h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-primary hover:underline"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-2"
          >
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex flex-shrink-0 flex-col items-center gap-2"
              >
                <div className="flex h-28 w-36 items-center justify-center rounded-lg bg-muted sm:h-32 sm:w-40">
                  <span className="text-sm text-muted-foreground">140x80</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
