import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategories,
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

  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      categoryName={category?.name ?? "หมวดหมู่"}
      categorySlug={category?.slug ?? ""}
    />
  );
}
