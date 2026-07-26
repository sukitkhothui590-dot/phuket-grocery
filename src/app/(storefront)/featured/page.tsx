import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "สินค้าแนะนำ",
  description: "สินค้าขายดี คัดมาเพื่อร้านค้าของคุณ",
};

export default async function FeaturedProductsPage() {
  const products = await getFeaturedProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">สินค้าแนะนำ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          สินค้าขายดี คัดมาเพื่อร้านค้าของคุณ
        </p>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          ยังไม่มีสินค้าแนะนำในขณะนี้
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
