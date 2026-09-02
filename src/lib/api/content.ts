import { apiGet, apiPost } from "@/lib/api/client";
import { mapBanner, mapBlog, mapFaq } from "@/lib/api/mappers";
import { getPublicSettings } from "@/lib/api/settings";
import { COMPANY_INFO } from "@/lib/constants";
import { decodeRouteParam } from "@/lib/route-params";
import { resolveStoreLink } from "@/lib/store-links";
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
      link: resolveStoreLink(banner.link),
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
  type BackendBlogItem = {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    author?: string | null;
    featuredImage?: string | null;
    publishedAt?: string | null;
    createdAt: string;
  };

  // Storefront blog index must load every published post, not a truncated first page.
  const pageSize = limit ? Math.min(limit, 100) : 100;
  const collected: BackendBlogItem[] = [];
  let page = 1;
  let total = Number.POSITIVE_INFINITY;

  while (collected.length < total) {
    const response = await apiGet<BackendBlogItem[]>("/public/blogs", {
      searchParams: {
        limit: pageSize,
        page,
      },
    });

    if (!response.success) {
      break;
    }

    collected.push(...response.data);
    total = response.meta?.total ?? collected.length;
    const totalPages = response.meta?.totalPages ?? page;

    if (
      response.data.length === 0 ||
      page >= totalPages ||
      (limit != null && collected.length >= limit)
    ) {
      break;
    }

    page += 1;
  }

  const posts = collected.map(mapBlog);
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

  // Empty until Google Places is connected: these would be shown as real reviews
  // of the shop, so the placeholder testimonials in mock-data/content.ts must not
  // reach a live storefront. GoogleReviews renders a link to the Google page when
  // the list is empty. `googleReviews` in @/lib/mock-data/content is still there
  // for design work.
  return {
    reviews: [],
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

