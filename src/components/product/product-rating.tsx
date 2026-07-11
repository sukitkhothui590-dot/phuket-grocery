"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating?: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

function StarsRow({
  rating,
  size,
  empty,
}: {
  rating: number;
  size: "sm" | "md";
  empty?: boolean;
}) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const filled = !empty && rating >= starValue;
        const half = !empty && !filled && rating >= starValue - 0.5;

        return (
          <span key={starValue} className="relative inline-flex">
            <Star
              className={cn(
                starSize,
                empty || (!filled && !half)
                  ? "fill-muted text-muted"
                  : "fill-yellow-400 text-yellow-400",
              )}
            />
            {half && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className={cn(starSize, "fill-yellow-400 text-yellow-400")} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ProductRating({
  rating = 0,
  count = 0,
  size = "sm",
  className,
}: ProductRatingProps) {
  if (!count && !rating) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-muted-foreground",
          className,
        )}
      >
        <StarsRow rating={0} size={size} empty />
        <span className={size === "sm" ? "text-[11px]" : "text-xs"}>
          ยังไม่มีรีวิว
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <StarsRow rating={rating} size={size} />
      <span
        className={cn(
          "font-semibold text-foreground",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      >
        {rating.toFixed(1)}
      </span>
      <span
        className={cn(
          "text-muted-foreground",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      >
        ({count.toLocaleString()})
      </span>
    </div>
  );
}
