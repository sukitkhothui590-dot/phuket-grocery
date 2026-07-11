"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % banners.length),
    [banners.length]
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="flex"
        style={{
          width: `${banners.length * 100}%`,
          transform: `translateX(-${current * (100 / banners.length)}%)`,
          transition: "transform 500ms ease-in-out",
        }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link ?? "/categories"}
            style={{ width: `${100 / banners.length}%` }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="block h-auto w-full"
              draggable={false}
            />
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 sm:left-4 sm:h-10 sm:w-10"
            onClick={(e) => {
              e.preventDefault();
              prev();
            }}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 sm:right-4 sm:h-10 sm:w-10"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-4">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? "w-6 bg-white sm:w-8"
                    : "w-2 bg-white/50 sm:w-2.5"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
