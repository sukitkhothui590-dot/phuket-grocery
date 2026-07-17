import { Megaphone, PackageOpen } from "lucide-react";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { getActiveCampaigns } from "@/lib/api/campaigns";

export default async function CampaignsPage() {
  const { campaigns } = await getActiveCampaigns({ limit: 20 });

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Megaphone className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-foreground">
            แคมเปญลดราคา
          </h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          รายละเอียดแคมเปญที่กำลังจัด — สินค้าดีลพิเศษทั้งหมดดูได้ที่{" "}
          <Link href="/deals" className="font-semibold text-primary hover:underline">
            ดีลพิเศษ
          </Link>
        </p>
      </header>

      <section>
        {campaigns.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-slate-50 px-6 py-16 text-center">
            <PackageOpen className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              ยังไม่มีแคมเปญที่เปิดใช้งาน
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              กลับมาตรวจสอบอีกครั้งภายหลัง
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
