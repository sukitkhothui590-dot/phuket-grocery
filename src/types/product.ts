export type UnitType = "piece" | "box" | "case";

export interface ProductUnit {
  id?: string;
  unitType: UnitType;
  labelTh: string;
  labelEn: string;
  price: number;
  compareAtPrice?: number;
  conversionRate: number;
  sku: string;
  stock: number;
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
