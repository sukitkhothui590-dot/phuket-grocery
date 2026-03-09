import { HeroBanner } from "@/components/home/hero-banner";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryProductSection } from "@/components/home/category-product-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { GoogleReviews } from "@/components/home/google-reviews";
import { NewsSection } from "@/components/home/news-section";
import { getBanners, getBlogPosts, getGoogleReviews } from "@/lib/api/content";
import {
  getFeaturedProducts,
  getCategories,
  getProductsByCategory,
} from "@/lib/api/products";

export default async function HomePage() {
  const [banners, categories, featuredProducts, reviews, posts] =
    await Promise.all([
      getBanners(),
      getCategories(),
      getFeaturedProducts(),
      getGoogleReviews(),
      getBlogPosts(3),
    ]);

  const showcaseCategories = categories.filter((c) => c.id !== "cat-2").slice(0, 2);
  const categoryProducts = await Promise.all(
    showcaseCategories.map((cat) => getProductsByCategory(cat.id, 10))
  );

  return (
    <>
      <HeroBanner banners={banners} />
      <CategoryGrid categories={categories} />
      <PromotionGrid />
      <FeaturedProducts title="สินค้าแนะนำ" products={featuredProducts} />

      {showcaseCategories.map((cat, idx) => (
        <CategoryProductSection
          key={cat.id}
          category={cat}
          products={categoryProducts[idx]}
        />
      ))}

      <TrustBadges />
      <GoogleReviews reviews={reviews} />
      <NewsSection posts={posts} />
    </>
  );
}
