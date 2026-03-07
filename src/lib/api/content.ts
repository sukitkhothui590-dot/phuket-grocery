import { banners, promotionCards, blogPosts, faqs, googleReviews } from "@/lib/mock-data";
import type { Banner, PromotionCard, BlogPost, FAQ, GoogleReview } from "@/types";

export async function getBanners(): Promise<Banner[]> {
  return banners.sort((a, b) => a.order - b.order);
}

export async function getPromotionCards(): Promise<PromotionCard[]> {
  return promotionCards;
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const sorted = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function getFAQs(): Promise<FAQ[]> {
  return faqs.sort((a, b) => a.order - b.order);
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  return googleReviews;
}
