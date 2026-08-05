import { apiGet, apiPost } from "@/lib/api/client";
import { resolveMediaUrls } from "@/lib/api/media";

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface BackendReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  images?: string[];
  imageUrls?: string[];
  createdAt: string;
}

function mapReview(review: BackendReview): ProductReview {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    images: resolveMediaUrls(review.imageUrls ?? review.images ?? []),
    createdAt: review.createdAt,
  };
}

export async function getProductReviews(
  productSlug: string,
  page = 1,
  limit = 20,
): Promise<{
  reviews: ProductReview[];
  averageRating: number;
  count: number;
  total: number;
}> {
  const response = await apiGet<{
    items: BackendReview[];
    averageRating: number;
    count: number;
    meta?: { total: number };
  }>(`/products/${productSlug}/reviews`, {
    searchParams: { page, limit },
  });

  if (!response.success) {
    return { reviews: [], averageRating: 0, count: 0, total: 0 };
  }

  return {
    reviews: response.data.items.map(mapReview),
    averageRating: response.data.averageRating,
    count: response.data.count,
    total: response.data.meta?.total ?? response.data.count,
  };
}

export type ReviewEligibilityReason = "ok" | "not_purchased" | "already_reviewed";

/**
 * Only a signed-in customer who took delivery of the product may review it.
 * Asking up front lets the page render the right state instead of rejecting a
 * review the customer has already typed out.
 */
export async function getReviewEligibility(
  productSlug: string,
  token: string,
): Promise<{ canReview: boolean; reason: ReviewEligibilityReason }> {
  const response = await apiGet<{
    canReview: boolean;
    reason: ReviewEligibilityReason;
  }>(`/products/${productSlug}/reviews/eligibility`, { token });

  if (!response.success) {
    return { canReview: false, reason: "not_purchased" };
  }
  return response.data;
}

export async function submitProductReview(
  productSlug: string,
  token: string,
  data: {
    rating: number;
    comment: string;
    imageUrls?: string[];
  },
): Promise<{ success: boolean; review?: ProductReview; error?: string }> {
  // The token must be passed through: apiRequest only retries a 401 with a
  // refreshed token when the original request carried one.
  const response = await apiPost<BackendReview>(
    `/products/${productSlug}/reviews`,
    {
      rating: data.rating,
      comment: data.comment,
      imageUrls: data.imageUrls,
    },
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถส่งรีวิวได้",
    };
  }

  return {
    success: true,
    review: mapReview(response.data),
  };
}
