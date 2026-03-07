"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/types";
import { getPlaceholderUrl } from "@/lib/placeholder";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prev = () =>
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  if (banners.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[460px]">
        {banners.map((banner, i) => (
          <Link
            key={banner.id}
            href={banner.link ?? "/categories"}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="flex h-full w-full items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${getPlaceholderUrl(1200, 460, "Banner")})`,
              }}
            />
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white/70 hover:bg-white/90"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white/70 hover:bg-white/90"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
