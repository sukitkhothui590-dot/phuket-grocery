import { apiGet } from "@/lib/api/client";
import {
  mapCategories,
  mapProduct,
  type BackendCategory,
  type BackendProduct,
} from "@/lib/api/mappers";
import { decodeRouteParam } from "@/lib/route-params";
import type { Category, Product } from "@/types";

type ProductSort = "price-asc" | "price-desc" | "newest";

function toApiSort(sort?: ProductSort) {
  if (sort === "price-asc") return "price_asc";
  if (sort === "price-desc") return "price_desc";
  if (sort === "newest") return "newest";
  return undefined;
}

export async function getProducts(params?: {
  categoryId?: string;
  subcategoryId?: string;
  /** Parent slug expands to parent + direct children on the API. */
  categorySlug?: string;
  /**
   * When true with categoryId, include products on direct child categories.
   * Prefer this over N parallel per-child requests (avoids API 429s).
   */
  includeDescendants?: boolean;
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
      categorySlug: params?.categorySlug,
      includeDescendants: params?.includeDescendants ? "true" : undefined,
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

export async function searchProductSuggestions(
  query: string,
  options?: {
    categorySlug?: string;
    limit?: number;
    signal?: AbortSignal;
  },
): Promise<{ products: Product[]; total: number }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { products: [], total: 0 };
  }

  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      search: trimmed,
      categorySlug: options?.categorySlug,
      limit: options?.limit ?? 8,
      page: 1,
    },
    signal: options?.signal,
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
 * Live API keeps inventory on leaf categories — use includeDescendants (one
 * request) instead of parallel parent+child fetches that trip rate limits.
 * `sub` accepts subcategory slug or id (nav uses slug; filters may use id).
 */
export async function getProductsInCategory(
  category: Category,
  options?: {
    sub?: string;
    search?: string;
    sort?: ProductSort;
    page?: number;
    limit?: number;
  },
): Promise<{ products: Product[]; total: number }> {
  const limit = options?.limit ?? 24;
  const page = options?.page ?? 1;
  const subKey = options?.sub?.trim()
    ? decodeRouteParam(options.sub.trim())
    : undefined;

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
        page,
      });
    }
  }

  // Single API call: parent id + direct children (Nest includeDescendants).
  return getProducts({
    categoryId: category.id,
    includeDescendants: true,
    search: options?.search,
    sort: options?.sort,
    limit,
    page,
  });
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  const key = decodeRouteParam(slug);
  const response = await apiGet<BackendProduct>(
    `/products/${encodeURIComponent(key)}`,
  );

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

export async function getFeaturedProducts(limit = 48): Promise<Product[]> {
  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      featured: "true",
      limit,
      page: 1,
    },
  });

  if (!response.success) {
    return [];
  }

  return response.data.map(mapProduct);
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

  return products;
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
    products: result.products,
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

  return response.data.map(mapProduct);
}

export async function getBestSellerProducts(limit = 5): Promise<Product[]> {
  const { products } = await getProducts({
    sort: "price-asc",
    limit,
  });
  return products.slice(0, limit);
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<Product[]> {
  const { products } = await getProducts({
    categoryId,
    limit: 5,
  });

  return products.filter((product) => product.id !== productId).slice(0, 4);
}

export async function getProductsByCategory(
  categoryId: string,
  limit = 5,
): Promise<Product[]> {
  const categories = await getCategories();
  const root = categories.find((category) => category.id === categoryId);

  if (root) {
    const { products } = await getProductsInCategory(root, { limit });
    return products;
  }

  const { products } = await getProducts({ categoryId, limit });
  return products;
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
  // Next may leave non-ASCII path segments percent-encoded in `params.slug`.
  const key = decodeRouteParam(slug);
  const categories = await getCategories();
  const root = categories.find(
    (category) => category.slug === key || category.slug === slug,
  );
  if (root) return root;

  // Leaf slug used as path segment (e.g. /categories/กาแฟ) → parent root.
  return (
    categories.find((category) =>
      category.subcategories.some(
        (sub) => sub.slug === key || sub.slug === slug || sub.id === key,
      ),
    ) ?? null
  );
}

/**
 * Resolve a category route slug to root + optional active subcategory.
 * Supports both `/categories/parent` and `/categories/leaf` (leaf → parent + sub).
 */
export async function resolveCategoryRoute(slug: string): Promise<{
  category: Category;
  subFromPath?: string;
} | null> {
  const key = decodeRouteParam(slug);
  const categories = await getCategories();

  const root = categories.find(
    (category) => category.slug === key || category.slug === slug,
  );
  if (root) return { category: root };

  for (const category of categories) {
    const leaf = category.subcategories.find(
      (sub) => sub.slug === key || sub.slug === slug || sub.id === key,
    );
    if (leaf) {
      return { category, subFromPath: leaf.slug };
    }
  }

  return null;
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
