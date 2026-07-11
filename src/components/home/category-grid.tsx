"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";
import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories]);

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="bg-white py-5 sm:py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pr-14 sm:gap-5 sm:pr-16"
          >
            {categories.map((cat) => {
              const href = `/categories/${cat.slug}`;
              const isActive = pathname === href || pathname.startsWith(`${href}?`);

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group flex w-[84px] flex-shrink-0 snap-start flex-col items-center gap-2.5 sm:w-[96px]"
                >
                  <div
                    className={cn(
                      "flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border bg-white p-1 transition-all sm:h-20 sm:w-20 sm:p-1.5",
                      isActive
                        ? "border-primary shadow-[0_0_0_1px_rgba(25,179,177,0.15)]"
                        : "border-slate-200 group-hover:border-primary group-hover:shadow-md"
                    )}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <span
                    className={cn(
                      "line-clamp-2 text-center text-[11px] font-medium leading-tight sm:text-xs",
                      isActive
                        ? "text-primary"
                        : "text-foreground group-hover:text-primary"
                    )}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={scrollRight}
              aria-label="เลื่อนดูหมวดหมู่เพิ่มเติม"
              className="absolute right-0 top-[34%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-[0_4px_16px_rgba(15,23,42,0.12)] transition-colors hover:bg-slate-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
