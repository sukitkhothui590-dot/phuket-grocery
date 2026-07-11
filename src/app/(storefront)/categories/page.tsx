import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api/products";
import { enrichProductsWithRatings } from "@/lib/product-ratings";
import { ProductCard } from "@/components/product/product-card";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const query = search?.trim();

  if (query) {
    const { products: rawProducts, total } = await getProducts({
      search: query,
      limit: 24,
    });
    const products = await enrichProductsWithRatings(rawProducts);

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            ผลการค้นหา &ldquo;{query}&rdquo;
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            พบ {total.toLocaleString()} รายการ
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-slate-50 px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">
              ไม่พบสินค้าที่ตรงกับคำค้นหา ลองค้นหาด้วยคำอื่น
            </p>
            <Link
              href="/categories"
              className="mt-4 inline-flex text-sm text-primary hover:underline"
            >
              ดูหมวดหมู่ทั้งหมด
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">หมวดหมู่ทั้งหมด</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
          >
            <div className="overflow-hidden rounded-t-lg bg-white">
              <img
                src={category.image}
                alt={category.name}
                className="aspect-square h-full w-full scale-[1.06] object-cover object-center transition-transform duration-300 group-hover:scale-[1.12]"
              />
            </div>
            <div className="p-3">
              <h2 className="text-sm font-semibold text-foreground">{category.name}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {category.productCount ?? 0} สินค้า
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
