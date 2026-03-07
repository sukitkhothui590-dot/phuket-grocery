"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";
import { useEffect, useState } from "react";

interface DealOfTheDayProps {
  products: Product[];
}

function useCountdown() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const getRemaining = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTime(getRemaining());
    const timer = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-lg font-bold text-[#01A1AF] sm:h-12 sm:w-12 sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] text-white/70">{label}</span>
    </div>
  );
}

export function DealOfTheDay({ products }: DealOfTheDayProps) {
  const { hours, minutes, seconds } = useCountdown();

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="overflow-hidden rounded-xl border">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#01A1AF] px-6 py-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">
                ดีลประจำวัน
              </h2>
              <p className="text-xs text-white/70">
                ราคาพิเศษ หมดเขตสิ้นวันนี้!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CountdownBox value={hours} label="ชม." />
            <span className="text-xl font-bold text-white">:</span>
            <CountdownBox value={minutes} label="นาที" />
            <span className="text-xl font-bold text-white">:</span>
            <CountdownBox value={seconds} label="วินาที" />
          </div>

          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm font-medium text-white transition-colors hover:text-white/80"
          >
            ดูทั้งหมด
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products */}
        <div className="bg-white p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
