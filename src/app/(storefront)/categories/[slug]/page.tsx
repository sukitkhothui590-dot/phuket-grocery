import {
  getProductsInCategory,
  resolveCategoryRoute,
} from "@/lib/api/products";
import {
  STOREFRONT_PAGE_SIZE,
  parsePage,
} from "@/components/product/product-pagination";
import { decodeRouteParam } from "@/lib/route-params";
import { getUnitDisplayLabel, sortProductUnits } from "@/lib/product-promo";
import { notFound } from "next/navigation";
import { CategoryProductsClient } from "./category-products-client";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sub?: string;
    search?: string;
    sort?: string;
    unit?: string;
    page?: string;
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
  const unit = sp.unit?.trim() ?? "";
  const page = parsePage(sp.page);

  const { products, total } = await getProductsInCategory(category, {
    sub,
    search: sp.search || undefined,
    sort,
    page: unit ? 1 : page,
    limit: unit ? 200 : STOREFRONT_PAGE_SIZE,
  });

  const activeSub =
    category.subcategories.find(
      (item) => item.slug === sub || item.id === sub,
    )?.slug ?? "";
  const unitOptions = Array.from(
    new Set(
      products
        .flatMap((product) => sortProductUnits(product.units))
        .map(getUnitDisplayLabel)
        .filter(Boolean),
    ),
  );
  const matchingProducts = unit
    ? products.filter((product) =>
        product.units.some((productUnit) => getUnitDisplayLabel(productUnit) === unit),
      )
    : products;
  const filteredTotal = unit ? matchingProducts.length : total;
  const filteredProducts = unit
    ? matchingProducts.slice(
        (page - 1) * STOREFRONT_PAGE_SIZE,
        page * STOREFRONT_PAGE_SIZE,
      )
    : matchingProducts;

  return (
    <CategoryProductsClient
      category={category}
      products={filteredProducts}
      total={filteredTotal}
      page={page}
      currentSub={activeSub}
      currentSearch={sp.search ?? ""}
      currentSort={sp.sort ?? ""}
      currentUnit={sp.unit ?? ""}
      unitOptions={unitOptions}
    />
  );
}
