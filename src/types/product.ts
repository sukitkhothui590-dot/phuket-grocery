export type UnitType = "piece" | "box" | "case";

export interface ProductUnit {
  id?: string;
  unitType: UnitType;
  labelTh: string;
  labelEn: string;
  /** Effective price after the backend applies the winning campaign. */
  price: number;
  /** Original catalog price before campaign pricing. */
  basePrice?: number;
  /** Reference price supplied by the backend for strike-through display. */
  listPrice?: number;
  compareAtPrice?: number;
  salePriceOverride?: number;
  dealId?: string;
  conversionRate: number;
  sku: string;
  stock: number;
}

export interface ActiveDeal {
  id: string;
  slug: string;
  title: string;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  categoryId: string;
  subcategoryId?: string;
  units: ProductUnit[];
  baseUnit: UnitType;
  baseStock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  averageRating?: number;
  reviewCount?: number;
  activeDeal?: ActiveDeal | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  image?: string;
}
