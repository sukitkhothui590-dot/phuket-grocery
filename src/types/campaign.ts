import type { Product } from "./product";

export type CampaignDiscountMode = "PERCENT" | "FIXED_OFF" | "UNIT_PRICE";

export interface CampaignSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  badge?: string;
  discountMode: CampaignDiscountMode;
  value?: number;
  startsAt: string;
  endsAt: string;
  sortOrder: number;
  productCount: number;
  categoryCount: number;
}

export interface CampaignCategory {
  id: string;
  name: string;
}

export interface CampaignDetail extends CampaignSummary {
  isActive: boolean;
  categoryIds: string[];
  categories: CampaignCategory[];
  products: Product[];
}
