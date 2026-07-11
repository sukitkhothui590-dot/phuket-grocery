import { apiGet, apiPost } from "@/lib/api/client";

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
    images: review.imageUrls ?? review.images ?? [],
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

export async function submitProductReview(
  productSlug: string,
  data: {
    name?: string;
    rating: number;
    comment: string;
    imageUrls?: string[];
  },
): Promise<{ success: boolean; review?: ProductReview; error?: string }> {
  const response = await apiPost<BackendReview>(
    `/products/${productSlug}/reviews`,
    {
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      imageUrls: data.imageUrls,
    },
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
