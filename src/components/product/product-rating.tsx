"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * What a product shows before anyone has reviewed it. The API still reports the
 * honest `averageRating: 0, reviewCount: 0` — only the display substitutes this.
 */
export const DEFAULT_RATING = 5;

interface ProductRatingProps {
  rating?: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

function StarsRow({ rating, size }: { rating: number; size: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const filled = rating >= starValue;
        const half = !filled && rating >= starValue - 0.5;

        return (
          <span key={starValue} className="relative inline-flex">
            <Star
              className={cn(
                starSize,
                !filled && !half
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
  // No reviews yet → full five stars, with the (0) count keeping it honest
  // about there being nothing behind the score.
  const displayed = !count && !rating ? DEFAULT_RATING : rating;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <StarsRow rating={displayed} size={size} />
      <span
        className={cn(
          "font-semibold text-foreground",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      >
        {displayed.toFixed(1)}
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
