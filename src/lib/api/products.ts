import { apiGet } from "@/lib/api/client";
import {
  mapCategories,
  mapProduct,
  type BackendCategory,
  type BackendProduct,
} from "@/lib/api/mappers";
import { enrichProductsWithRatings } from "@/lib/product-ratings";
import type { Category, Product } from "@/types";

type ProductSort = "price-asc" | "price-desc" | "newest";

function toApiSort(sort?: ProductSort) {
  if (sort === "price-asc") return "price_asc";
  if (sort === "price-desc") return "price_desc";
  if (sort === "newest") return "newest";
  return undefined;
}

function sortProducts(products: Product[], sort?: ProductSort): Product[] {
  if (sort === "price-asc") {
    return [...products].sort(
      (a, b) => (a.units[0]?.price ?? 0) - (b.units[0]?.price ?? 0),
    );
  }
  if (sort === "price-desc") {
    return [...products].sort(
      (a, b) => (b.units[0]?.price ?? 0) - (a.units[0]?.price ?? 0),
    );
  }
  if (sort === "newest") {
    return [...products].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return products;
}

function dedupeProducts(groups: Product[][]): Product[] {
  const byId = new Map<string, Product>();
  for (const products of groups) {
    for (const product of products) {
      byId.set(product.id, product);
    }
  }
  return [...byId.values()];
}

export async function getProducts(params?: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  /**
   * Special Deal (ดีลพิเศษ): backend union of static compareAt sales
   * and products under an active campaign. Prefer this over /campaigns/*.
   */
  onSale?: boolean;
}): Promise<{ products: Product[]; total: number }> {
  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      categoryId: params?.categoryId ?? params?.subcategoryId,
      search: params?.search,
      page: params?.page ?? 1,
      limit: params?.limit ?? 12,
      onSale: params?.onSale ? "true" : undefined,
      sort: toApiSort(params?.sort),
    },
  });

  if (!response.success) {
    return { products: [], total: 0 };
  }

  return {
    products: response.data.map(mapProduct),
    total: response.meta?.total ?? response.data.length,
  };
}

/**
 * Load products for a storefront category page.
 * Live API keeps inventory on leaf categories, so "all" unions parent + children.
 * `sub` accepts subcategory slug or id (nav uses slug; filters may use id).
 */
export async function getProductsInCategory(
  category: Category,
  options?: {
    sub?: string;
    search?: string;
    sort?: ProductSort;
    limit?: number;
  },
): Promise<{ products: Product[]; total: number }> {
  const limit = options?.limit ?? 100;
  const subKey = options?.sub?.trim();

  if (subKey) {
    const leaf = category.subcategories.find(
      (sub) => sub.slug === subKey || sub.id === subKey,
    );
    if (leaf) {
      return getProducts({
        categoryId: leaf.id,
        search: options?.search,
        sort: options?.sort,
        limit,
        page: 1,
      });
    }
  }

  const scopeIds = [
    category.id,
    ...category.subcategories.map((sub) => sub.id),
  ];

  const pages = await Promise.all(
    scopeIds.map((categoryId) =>
      getProducts({
        categoryId,
        search: options?.search,
        sort: options?.sort,
        limit,
        page: 1,
      }),
    ),
  );

  const products = sortProducts(
    dedupeProducts(pages.map((page) => page.products)),
    options?.sort,
  ).slice(0, limit);

  const total = pages.reduce((sum, page) => sum + page.total, 0);

  return {
    products,
    // Prefer deduped size when we have the full window; fall back to summed totals.
    total: products.length < limit ? products.length : Math.max(total, products.length),
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const response = await apiGet<BackendProduct>(`/products/${slug}`);

  if (!response.success) {
    return null;
  }

  return mapProduct(response.data);
}

export async function getProductById(
  id: string,
): Promise<Product | null> {
  const response = await apiGet<BackendProduct>(`/products/${id}`);

  if (!response.success) {
    return null;
  }

  return mapProduct(response.data);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      isFeatured: "true",
      limit: 8,
      page: 1,
    },
  });

  if (!response.success) {
    return [];
  }

  return enrichProductsWithRatings(response.data.map(mapProduct));
}

/**
 * Homepage Special Deal carousel.
 * Always `GET /products?onSale=true` — never `/campaigns/active`.
 */
export async function getPromoProducts(limit = 12): Promise<Product[]> {
  const { products } = await getProducts({
    onSale: true,
    page: 1,
    limit,
  });

  return enrichProductsWithRatings(products);
}

/**
 * `/deals` Special Deal grid.
 * Always `GET /products?onSale=true` — never `/campaigns/active`.
 */
export async function getOnSaleProducts(params?: {
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> {
  const result = await getProducts({
    onSale: true,
    page: params?.page ?? 1,
    limit: params?.limit ?? 24,
  });

  return {
    products: await enrichProductsWithRatings(result.products),
    total: result.total,
  };
}

export async function getNewProducts(limit = 10): Promise<Product[]> {
  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      isNew: "true",
      limit,
      page: 1,
      sort: "newest",
    },
  });

  if (!response.success) {
    return [];
  }

  return enrichProductsWithRatings(response.data.map(mapProduct));
}

export async function getBestSellerProducts(limit = 5): Promise<Product[]> {
  const { products } = await getProducts({
    sort: "price-asc",
    limit,
  });
  return enrichProductsWithRatings(products.slice(0, limit));
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<Product[]> {
  const { products } = await getProducts({
    categoryId,
    limit: 5,
  });

  return enrichProductsWithRatings(
    products.filter((product) => product.id !== productId).slice(0, 4),
  );
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 5,
): Promise<Product[]> {
  const categories = await getCategories();
  const root = categories.find((category) => category.id === categoryId);

  if (root) {
    const { products } = await getProductsInCategory(root, { limit });
    return enrichProductsWithRatings(products);
  }

  const { products } = await getProducts({ categoryId, limit });
  return enrichProductsWithRatings(products);
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiGet<BackendCategory[]>("/categories");

  if (!response.success) {
    return [];
  }

  return mapCategories(response.data);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  // Always resolve from the full tree so parent pages keep their subcategories.
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

/** Resolve product.categoryId which may be a root or leaf id. */
export function resolveProductCategory(
  categories: Category[],
  categoryId: string,
): {
  root: Category;
  subcategory?: Category["subcategories"][number];
} | null {
  for (const root of categories) {
    if (root.id === categoryId) {
      return { root };
    }
    const subcategory = root.subcategories.find((sub) => sub.id === categoryId);
    if (subcategory) {
      return { root, subcategory };
    }
  }
  return null;
}
