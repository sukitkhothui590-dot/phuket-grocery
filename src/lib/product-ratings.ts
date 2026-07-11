import { getProductReviews } from "@/lib/api/reviews";
import type { Product } from "@/types";

export async function enrichProductsWithRatings(
  products: Product[],
): Promise<Product[]> {
  if (products.length === 0) return products;

  return Promise.all(
    products.map(async (product) => {
      try {
        const reviews = await getProductReviews(product.slug, 1, 1);
        return {
          ...product,
          averageRating: reviews.averageRating,
          reviewCount: reviews.count,
        };
      } catch {
        return product;
      }
    }),
  );
}
