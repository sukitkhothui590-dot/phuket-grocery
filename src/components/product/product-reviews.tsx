"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Star,
  MessageSquarePlus,
  UserRound,
  ImagePlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getProductReviews,
  submitProductReview,
  type ProductReview,
} from "@/lib/api/reviews";
import { uploadFile } from "@/lib/api/upload";
import { useAuthStore } from "@/stores/auth-store";

interface ProductReviewsProps {
  productSlug: string;
}

const MAX_IMAGES = 4;

function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = (hover || value) > i;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHover(i + 1)}
            onMouseLeave={() => interactive && setHover(0)}
            className={cn(interactive && "cursor-pointer", !interactive && "cursor-default")}
            aria-label={`ให้ ${i + 1} ดาว`}
          >
            <Star
              className={cn(
                dimension,
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ProductReviews({ productSlug }: ProductReviewsProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const data = await getProductReviews(productSlug);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setReviewCount(data.count);
      setLoading(false);
    })();
  }, [productSlug]);

  const average = useMemo(() => {
    if (reviewCount > 0) return averageRating;
    if (reviews.length === 0) return 0;
    return (
      Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
      ) / 10
    );
  }, [averageRating, reviewCount, reviews]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");

    if (!accessToken) {
      setError("กรุณาเข้าสู่ระบบเพื่อแนบรูปภาพ");
      return;
    }

    const remaining = MAX_IMAGES - imageFiles.length;
    const selected = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, remaining);

    if (selected.length === 0) {
      setError(`อัปโหลดได้สูงสุด ${MAX_IMAGES} รูป`);
      return;
    }

    setImageFiles((prev) => [...prev, ...selected].slice(0, MAX_IMAGES));
    setImagePreviews((prev) => [
      ...prev,
      ...selected.map((file) => URL.createObjectURL(file)),
    ].slice(0, MAX_IMAGES));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("กรุณาให้คะแนนดาว");
      return;
    }
    if (!comment.trim()) {
      setError("กรุณาเขียนความคิดเห็น");
      return;
    }

    setSubmitting(true);
    setError("");

    const imageUrls: string[] = [];
    if (imageFiles.length > 0 && accessToken) {
      for (const file of imageFiles) {
        const uploadResult = await uploadFile(file, accessToken);
        if (uploadResult.success && uploadResult.url) {
          imageUrls.push(uploadResult.url);
        }
      }
    }

    const result = await submitProductReview(productSlug, {
      name: name.trim() || undefined,
      rating,
      comment: comment.trim(),
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    });

    setSubmitting(false);

    if (!result.success || !result.review) {
      setError(result.error ?? "ไม่สามารถส่งรีวิวได้");
      return;
    }

    setReviews((prev) => [result.review!, ...prev]);
    setReviewCount((prev) => prev + 1);
    setAverageRating((prev) => {
      const total = prev * (reviewCount) + rating;
      return Math.round((total / (reviewCount + 1)) * 10) / 10;
    });

    setName("");
    setRating(0);
    setComment("");
    setImageFiles([]);
    setImagePreviews([]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">
              {!loading ? average.toFixed(1) : "—"}
            </p>
            <StarRating value={Math.round(average)} size="sm" />
            <p className="mt-1 text-xs text-muted-foreground">
              {!loading ? `${reviewCount || reviews.length} รีวิว` : ""}
            </p>
          </div>
          <div className="flex-1 text-sm text-muted-foreground">
            แบ่งปันประสบการณ์ของคุณกับสินค้านี้
            เพื่อช่วยลูกค้าท่านอื่นในการตัดสินใจ
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4 rounded-lg border p-4"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            เขียนรีวิว
          </h3>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              ให้คะแนน
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              ชื่อ (ไม่บังคับ)
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ชื่อของคุณ"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              ความคิดเห็น
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="บอกเล่าความประทับใจหรือข้อเสนอแนะ..."
              rows={4}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">
              เพิ่มรูปภาพ (ไม่บังคับ)
            </label>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative h-16 w-16 overflow-hidden rounded-md border"
                >
                  <img
                    src={src}
                    alt={`รูปรีวิว ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                    aria-label="ลบรูป"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="text-[10px]">เพิ่มรูป</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">
              สูงสุด {MAX_IMAGES} รูป{!accessToken && " (ต้องเข้าสู่ระบบเพื่อแนบรูป)"}
            </p>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {submitted && (
            <p className="text-xs font-medium text-green-600">
              ขอบคุณสำหรับรีวิวของคุณ!
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
          </Button>
        </form>
      </div>

      <div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            กำลังโหลดรีวิว...
          </p>
        ) : reviews.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <Star className="h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              ยังไม่มีรีวิวสำหรับสินค้านี้
            </p>
            <p className="text-xs text-muted-foreground/70">
              เป็นคนแรกที่รีวิวสินค้านี้
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {review.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating value={review.rating} size="sm" />
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {review.comment}
                </p>

                {review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((src, idx) => (
                      <a
                        key={idx}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-20 w-20 overflow-hidden rounded-md border transition-transform hover:scale-105"
                      >
                        <img
                          src={src}
                          alt={`รูปรีวิวจาก ${review.name} ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
