import { apiGet, apiPost } from "@/lib/api/client";
import { mapBanner, mapBlog, mapFaq } from "@/lib/api/mappers";
import { getPublicSettings } from "@/lib/api/settings";
import { COMPANY_INFO } from "@/lib/constants";
import { googleReviews as mockGoogleReviews } from "@/lib/mock-data/content";
import { decodeRouteParam } from "@/lib/route-params";
import type { Banner, BlogPost, FAQ, GoogleReview, PromotionCard } from "@/types";

const PROMO_STYLES = [
  { bgClass: "bg-primary", textClass: "text-primary-foreground" },
  { bgClass: "bg-slate-800", textClass: "text-white" },
  { bgClass: "bg-primary", textClass: "text-white" },
] as const;

export async function getBanners(): Promise<Banner[]> {
  const response = await apiGet<
    Array<{
      id: string;
      title: string;
      imageUrl: string;
      link?: string | null;
      order: number;
    }>
  >("/public/banners");

  if (!response.success) {
    return [];
  }

  return response.data.map(mapBanner).sort((a, b) => a.order - b.order);
}

export async function getPromotionCards(): Promise<PromotionCard[]> {
  const [banners, settings] = await Promise.all([
    getBanners(),
    getPublicSettings(),
  ]);

  const threshold = settings.free_shipping_threshold ?? "1500";
  const promoBanners = banners.slice(0, 3);

  if (promoBanners.length > 0) {
    return promoBanners.map((banner, index) => ({
      id: banner.id,
      title: banner.title,
      subtitle:
        index === 2
          ? `จัดส่งรวดเร็ว สั่งครบ ${Number(threshold).toLocaleString()} ส่งฟรี`
          : banner.subtitle ?? "ช้อปสินค้าคุณภาพ ราคาส่ง",
      image: banner.image,
      link: banner.link ?? "/categories",
      bgClass: PROMO_STYLES[index]?.bgClass ?? "bg-primary",
      textClass: PROMO_STYLES[index]?.textClass ?? "text-white",
    }));
  }

  return [
    {
      id: "pb-1",
      title: "ราคาส่ง ถูกกว่าแน่นอน",
      subtitle: "ซื้อยกลังประหยัดสูงสุด 30%",
      image: "/promo/promo-1.png",
      link: "/categories",
      bgClass: "bg-primary",
      textClass: "text-primary-foreground",
    },
    {
      id: "pb-2",
      title: "สินค้าพร้อมส่ง ครบทุกหมวด",
      subtitle: "กว่า 1,000 รายการ จัดส่งทั่วภูเก็ต",
      image: "/promo/promo-2.png",
      link: "/categories",
      bgClass: "bg-slate-800",
      textClass: "text-white",
    },
    {
      id: "pb-3",
      title: `สั่งครบ ${Number(threshold).toLocaleString()} ส่งฟรี!`,
      subtitle: "จัดส่งรวดเร็ว 1-2 วันถึงหน้าร้าน",
      image: "/promo/promo-3.png",
      link: "/categories",
      bgClass: "bg-primary",
      textClass: "text-white",
    },
  ];
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const response = await apiGet<
    Array<{
      id: string;
      title: string;
      slug: string;
      excerpt?: string | null;
      content: string;
      author?: string | null;
      featuredImage?: string | null;
      publishedAt?: string | null;
      createdAt: string;
    }>
  >("/public/blogs", {
    searchParams: {
      limit: limit ?? 20,
      page: 1,
    },
  });

  if (!response.success) {
    return [];
  }

  const posts = response.data.map(mapBlog);
  return limit ? posts.slice(0, limit) : posts;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const key = decodeRouteParam(slug);
  const response = await apiGet<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    author?: string | null;
    featuredImage?: string | null;
    publishedAt?: string | null;
    createdAt: string;
  }>(`/public/blogs/${encodeURIComponent(key)}`);

  if (!response.success) {
    return null;
  }

  return mapBlog(response.data);
}

export async function getFAQs(): Promise<FAQ[]> {
  const response = await apiGet<
    Array<{
      id: string;
      question: string;
      answer: string;
      sortOrder: number;
    }>
  >("/public/faqs");

  if (!response.success) {
    return [];
  }

  return response.data.map(mapFaq).sort((a, b) => a.order - b.order);
}

export async function getGoogleReviews(): Promise<{
  reviews: GoogleReview[];
  reviewLink: string;
}> {
  const settings = await getPublicSettings();

  // Temporary mock reviews until Google Places API is connected
  return {
    reviews: mockGoogleReviews,
    reviewLink:
      settings.google_review_link ??
      settings.google_maps_url ??
      COMPANY_INFO.googleMapUrl,
  };
}

export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const response = await apiPost("/public/contact", data);

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถส่งข้อความได้",
    };
  }

  return { success: true };
}

export async function subscribeNewsletter(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await apiPost("/public/newsletter/subscribe", { email });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถสมัครรับข่าวสารได้",
    };
  }

  return { success: true };
}
