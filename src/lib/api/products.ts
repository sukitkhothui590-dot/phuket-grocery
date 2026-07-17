import { apiGet } from "@/lib/api/client";
import {
  mapCategories,
  mapProduct,
  type BackendCategory,
  type BackendProduct,
} from "@/lib/api/mappers";
import { enrichProductsWithRatings } from "@/lib/product-ratings";
import type { Category, Product } from "@/types";

export async function getProducts(params?: {
  categoryId?: string;
  subcategoryId?: string;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest";
  page?: number;
  limit?: number;
  /** Union of static compareAt discounts and active campaign products. */
  onSale?: boolean;
}): Promise<{ products: Product[]; total: number }> {
  const response = await apiGet<BackendProduct[]>("/products", {
    searchParams: {
      categoryId: params?.categoryId ?? params?.subcategoryId,
      search: params?.search,
      page: params?.page ?? 1,
      limit: params?.limit ?? 12,
      onSale: params?.onSale ? "true" : undefined,
      sort:
        params?.sort === "price-asc"
          ? "price_asc"
          : params?.sort === "price-desc"
            ? "price_desc"
            : params?.sort === "newest"
              ? "newest"
              : undefined,
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

/** Special deals — always from `GET /products?onSale=true`, never from campaigns/active. */
export async function getPromoProducts(limit = 12): Promise<Product[]> {
  const { products } = await getProducts({
    onSale: true,
    page: 1,
    limit,
  });

  return enrichProductsWithRatings(products);
}

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
  const response = await apiGet<BackendCategory>(`/categories/${slug}`);

  if (!response.success) {
    return null;
  }

  const categories = mapCategories([response.data]);
  return categories[0] ?? null;
}
