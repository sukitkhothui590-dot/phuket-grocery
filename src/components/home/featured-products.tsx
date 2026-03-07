import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function FeaturedProducts({
  title,
  products,
  viewAllLink = "/categories",
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground">
              สินค้าขายดี คัดมาเพื่อร้านค้าของคุณ
            </p>
          </div>
        </div>
        <Link
          href={viewAllLink}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          ดูทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
