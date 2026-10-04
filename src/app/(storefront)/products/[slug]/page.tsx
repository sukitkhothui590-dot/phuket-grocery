import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getFrequentlyBoughtTogether,
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

  const [relatedProducts, frequentlyBoughtProducts, categories] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getFrequentlyBoughtTogether(product.id),
    getCategories(),
  ]);
  const mockPairingProducts = relatedProducts.slice(0, 2);
  const pairingProducts = frequentlyBoughtProducts.length
    ? frequentlyBoughtProducts
    : mockPairingProducts;
  const hasPurchaseRecommendations = frequentlyBoughtProducts.length > 0;
  const pairingProductIds = new Set(pairingProducts.map(({ id }) => id));
  const remainingRelatedProducts = relatedProducts.filter(
    ({ id }) => !pairingProductIds.has(id),
  );

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
      relatedProducts={remainingRelatedProducts}
      pairingProducts={pairingProducts}
      hasPurchaseRecommendations={hasPurchaseRecommendations}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
}
