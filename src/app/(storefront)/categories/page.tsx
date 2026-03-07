import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { products } from "@/lib/mock-data";

export default async function CategoriesPage() {
  const categories = await getCategories();

  const countByCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        หมวดหมู่ทั้งหมด
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={getPlaceholderUrl(400, 300, cat.name)}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h2 className="text-sm font-semibold text-foreground">
                {cat.name}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {countByCategory[cat.id] ?? 0} สินค้า
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
