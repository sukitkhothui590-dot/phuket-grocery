"use client";

import Link from "next/link";
import type { Category } from "@/types";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPlaceholderUrl } from "@/lib/placeholder";

interface CategoryIconsProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryIconsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="border-b bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-6 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-6"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex w-20 flex-shrink-0 flex-col items-center gap-2 sm:w-24"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-muted transition-all group-hover:border-primary group-hover:shadow-md sm:h-20 sm:w-20">
                  <img
                    src={getPlaceholderUrl(80, 80)}
                    alt={cat.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-foreground group-hover:text-primary sm:text-xs">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-6 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
