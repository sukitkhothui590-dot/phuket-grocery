import { products, categories } from "@/lib/mock-data";
import type { Product, Category } from "@/types";

export async function getProducts(params?: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> {
  let filtered = [...products];

  if (params?.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === params.categoryId);
  }
  if (params?.subcategoryId) {
    filtered = filtered.filter((p) => p.subcategoryId === params.subcategoryId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (params?.sort === "price-asc") {
    filtered.sort((a, b) => a.units[0].price - b.units[0].price);
  } else if (params?.sort === "price-desc") {
    filtered.sort((a, b) => b.units[0].price - a.units[0].price);
  } else if (params?.sort === "newest") {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  const total = filtered.length;
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 12;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);

  return { products: filtered, total };
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((p) => p.isFeatured);
}

export async function getNewProducts(limit = 10): Promise<Product[]> {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getBestSellerProducts(limit = 5): Promise<Product[]> {
  return [...products]
    .sort((a, b) => a.units[0].price - b.units[0].price)
    .slice(0, limit);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string
): Promise<Product[]> {
  return products
    .filter((p) => p.categoryId === categoryId && p.id !== productId)
    .slice(0, 4);
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 5
): Promise<Product[]> {
  return products
    .filter((p) => p.categoryId === categoryId)
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}
