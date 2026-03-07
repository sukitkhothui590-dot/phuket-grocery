import { Star } from "lucide-react";
import type { GoogleReview } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface GoogleReviewsProps {
  reviews: GoogleReview[];
}

export function GoogleReviews({ reviews }: GoogleReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-muted/50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-foreground">
            รีวิวจากลูกค้า
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ความเห็นจากลูกค้าที่ใช้บริการ
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white">
              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-3 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {review.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            ดูรีวิวทั้งหมดบน Google &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
