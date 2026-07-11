import { HeroBanner } from "@/components/home/hero-banner";
import { HomePromoCarousel } from "@/components/home/home-promo-carousel";
import { HomeCouponCategories } from "@/components/home/home-coupon-categories";
import { PromotionGrid } from "@/components/home/promotion-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryProductSection } from "@/components/home/category-product-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { GoogleReviews } from "@/components/home/google-reviews";
import { NewsSection } from "@/components/home/news-section";
import { getBanners, getBlogPosts, getGoogleReviews } from "@/lib/api/content";
import {
  getFeaturedProducts,
  getPromoProducts,
  getCategories,
  getProductsByCategory,
} from "@/lib/api/products";

export default async function HomePage() {
  const [banners, categories, featuredProducts, promoProducts, googleData, posts] =
    await Promise.all([
      getBanners(),
      getCategories(),
      getFeaturedProducts(),
      getPromoProducts(),
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
      <HomePromoCarousel products={promoProducts} />
      <HomeCouponCategories />
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
      <GoogleReviews reviews={googleData.reviews} reviewLink={googleData.reviewLink} />
      <NewsSection posts={posts} />
    </>
  );
}
