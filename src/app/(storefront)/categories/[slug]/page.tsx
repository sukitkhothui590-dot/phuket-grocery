import {
  getProductsInCategory,
  resolveCategoryRoute,
} from "@/lib/api/products";
import { decodeRouteParam } from "@/lib/route-params";
import { notFound } from "next/navigation";
import { CategoryProductsClient } from "./category-products-client";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sub?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug: rawSlug } = await params;
  const sp = await searchParams;

  // Path may be a root slug or a leaf slug; ?sub= still wins when present.
  const resolved = await resolveCategoryRoute(rawSlug);
  if (!resolved) notFound();

  const { category } = resolved;
  const sub = sp.sub
    ? decodeRouteParam(sp.sub)
    : resolved.subFromPath;

  const sort = (sp.sort as "price-asc" | "price-desc" | "newest") || undefined;

  const { products } = await getProductsInCategory(category, {
    sub,
    search: sp.search || undefined,
    sort,
    limit: 100,
  });

  const activeSub =
    category.subcategories.find(
      (item) => item.slug === sub || item.id === sub,
    )?.slug ?? "";

  return (
    <CategoryProductsClient
      category={category}
      products={products}
      currentSub={activeSub}
      currentSearch={sp.search ?? ""}
      currentSort={sp.sort ?? ""}
    />
  );
}
