import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { CampaignCard } from "@/components/campaign/campaign-card";
import type { CampaignSummary } from "@/types";

/**
 * Optional P2 marketing strip for campaign hub cards.
 * Not used as the product source for "ดีลพิเศษ" — that comes from onSale products.
 */
export function HomeCampaigns({
  campaigns,
}: {
  campaigns: CampaignSummary[];
}) {
  if (campaigns.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              แคมเปญที่กำลังจัด
            </h2>
            <p className="text-xs text-muted-foreground">
              ดูรายละเอียดแคมเปญ (ไม่ใช่แหล่งสินค้าดีลพิเศษ)
            </p>
          </div>
        </div>
        <Link
          href="/campaigns"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          ดูทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.slice(0, 3).map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} compact />
        ))}
      </div>
    </section>
  );
}
