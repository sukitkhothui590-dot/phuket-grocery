"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  id?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  visibleCount?: number;
  showCountdown?: boolean;
  children: ReactNode;
  className?: string;
}

function useDailyCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTime({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

function CountdownBox({ value }: { value: number }) {
  return (
    <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-slate-900 px-1 text-sm font-bold text-white tabular-nums shadow-sm">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export function ProductCarousel({
  id,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "ดูทั้งหมด",
  visibleCount = 5,
  showCountdown = false,
  children,
  className,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { h, m, s } = useDailyCountdown();

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
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth =
      el.firstElementChild?.clientWidth ?? el.clientWidth / visibleCount;
    const gap = 20;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) * 2 : (cardWidth + gap) * 2,
      behavior: "smooth",
    });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 border-y border-border bg-gradient-to-b from-slate-50 to-white py-10",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-destructive to-red-600 shadow-md shadow-destructive/25">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h2>
                {showCountdown && (
                  <div className="flex items-center gap-1.5">
                    <span className="mr-1 text-[11px] font-medium text-muted-foreground">
                      ปิดใน
                    </span>
                    <CountdownBox value={h} />
                    <span className="px-0.5 text-sm font-bold text-slate-400">:</span>
                    <CountdownBox value={m} />
                    <span className="px-0.5 text-sm font-bold text-slate-400">:</span>
                    <CountdownBox value={s} />
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {subtitle ?? "สินค้าโปรโมชั่น ลดราคาพิเศษเฉพาะวันนี้"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="เลื่อนไปทางซ้าย"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-slate-600 shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="เลื่อนไปทางขวา"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-slate-600 shadow-sm transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="flex items-center gap-1 rounded-full border border-primary/30 bg-white px-3.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {viewAllLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Track */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="scrollbar-hide flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
