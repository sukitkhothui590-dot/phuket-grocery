import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, PackageOpen, Tags } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { getCampaignBySlug } from "@/lib/api/campaigns";

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function benefitLabel(
  mode: "PERCENT" | "FIXED_OFF" | "UNIT_PRICE",
  value?: number,
) {
  if (mode === "PERCENT") return `ลด ${value ?? 0}%`;
  if (mode === "FIXED_OFF") {
    return `ลด ฿${(value ?? 0).toLocaleString()} ต่อหน่วย`;
  }
  return "ราคาพิเศษเฉพาะแคมเปญ";
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) notFound();

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-6 sm:py-8">
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        แคมเปญทั้งหมด
      </Link>

      <section className="mt-5 border border-slate-200 bg-white">
        <div className="h-1 bg-primary" />
        <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {campaign.badge ?? "แคมเปญ"}
              </span>
              <span className="text-xs text-muted-foreground">
                โปรโมชั่นจากภูเก็ตโกรเซอรี่
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {campaign.title}
            </h1>
            {campaign.description && (
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                {campaign.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                {formatDate(campaign.startsAt)} – {formatDate(campaign.endsAt)}
              </p>
              {campaign.categories.length > 0 && (
                <p className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-primary" />
                  {campaign.categories.map((category) => category.name).join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 pt-5 text-left sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-center">
            <p className="text-xs text-muted-foreground">สิทธิพิเศษ</p>
            <p className="mt-1 text-2xl font-extrabold text-destructive">
              {benefitLabel(campaign.discountMode, campaign.value)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ระบบปรับราคาให้อัตโนมัติ
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-foreground">
            สินค้าที่ร่วมรายการ
          </h2>
          <p className="text-sm text-muted-foreground">
            {campaign.products.length} สินค้า
          </p>
        </div>

        {campaign.products.length > 0 ? (
          <ProductGrid products={campaign.products} />
        ) : (
          <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-16 text-center">
            <PackageOpen className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              ยังไม่มีสินค้าในแคมเปญนี้
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              รายการสินค้าอาจถูกนำออกหรือแคมเปญสิ้นสุดแล้ว
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
