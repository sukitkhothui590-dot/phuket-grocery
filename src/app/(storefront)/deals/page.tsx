import Link from "next/link";
import { PackageOpen, Tag } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { getOnSaleProducts } from "@/lib/api/products";

export default async function DealsPage() {
  const { products, total } = await getOnSaleProducts({ limit: 48 });

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Tag className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">ดีลพิเศษ</h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          รวมสินค้าลดราคาจากราคาพิเศษของร้านและแคมเปญที่กำลังจัด
          ราคาที่แสดงเป็นราคาหลังหักส่วนลดแล้ว
        </p>
        {total > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            พบ {total.toLocaleString()} รายการ
          </p>
        )}
      </header>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-16 text-center">
          <PackageOpen className="mx-auto h-14 w-14 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            ยังไม่มีสินค้าในดีลพิเศษ
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            ยังไม่มีสินค้าลดราคาในตอนนี้ ลองดูหมวดหมู่สินค้าอื่นก่อน
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
