import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategories,
  resolveProductCategory,
} from "@/lib/api/products";
import { ProductDetailClient } from "@/components/product/product-detail-client";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [relatedProducts, categories] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getCategories(),
  ]);

  const resolved = resolveProductCategory(categories, product.categoryId);
  const categoryName = resolved?.subcategory?.name ?? resolved?.root.name ?? "หมวดหมู่";
  const categorySlug = resolved
    ? resolved.subcategory
      ? `${resolved.root.slug}?sub=${resolved.subcategory.slug}`
      : resolved.root.slug
    : "";

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
}
