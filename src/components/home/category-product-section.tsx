import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { getPlaceholderUrl } from "@/lib/placeholder";
import type { Product, Category } from "@/types";

interface CategoryProductSectionProps {
  category: Category;
  products: Product[];
}

export function CategoryProductSection({
  category,
  products,
}: CategoryProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-4">
      <div className="flex flex-col overflow-hidden rounded-lg border lg:flex-row">
        {/* Sidebar */}
        <div className="relative flex w-full flex-col justify-between bg-slate-800 p-5 text-white lg:w-[220px] lg:flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold">{category.name}</h3>
            <ul className="mt-3 hidden space-y-1.5 lg:block">
              {category.subcategories.slice(0, 5).map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/categories/${category.slug}?sub=${sub.slug}`}
                    className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 flex-shrink-0 rounded-full bg-primary/70" />
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={`/categories/${category.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary/50 transition-colors hover:text-white"
          >
            ดูทั้งหมด
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <img
            src={getPlaceholderUrl(96, 96)}
            alt=""
            className="absolute bottom-0 right-0 hidden h-24 w-24 object-cover opacity-10 lg:block"
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 bg-white p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
