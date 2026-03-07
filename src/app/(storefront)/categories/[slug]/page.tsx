import { getCategoryBySlug, getProducts } from "@/lib/api/products";
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
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sort = (sp.sort as "price-asc" | "price-desc" | "newest") || undefined;

  const { products } = await getProducts({
    categoryId: category.id,
    subcategoryId: sp.sub || undefined,
    search: sp.search || undefined,
    sort,
    limit: 100,
  });

  return (
    <CategoryProductsClient
      category={category}
      products={products}
      currentSub={sp.sub ?? ""}
      currentSearch={sp.search ?? ""}
      currentSort={sp.sort ?? ""}
    />
  );
}
