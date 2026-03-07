export * from "./product";
export * from "./order";
export * from "./user";

export interface Coupon {
  id: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  author: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatarUrl?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
}

export interface PromotionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgColor?: string;
}
