import Link from "next/link";
import { ArrowRight, CalendarDays, PackageOpen, Tags } from "lucide-react";
import type { CampaignSummary } from "@/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function benefitLabel(campaign: CampaignSummary) {
  if (campaign.discountMode === "PERCENT") {
    return `ลด ${campaign.value ?? 0}%`;
  }
  if (campaign.discountMode === "FIXED_OFF") {
    return `ลด ฿${(campaign.value ?? 0).toLocaleString()}`;
  }
  return "ราคาพิเศษ";
}

export function CampaignCard({
  campaign,
  compact = false,
}: {
  campaign: CampaignSummary;
  compact?: boolean;
}) {
  const targetCount = campaign.productCount + campaign.categoryCount;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-primary/30 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {campaign.badge ?? "แคมเปญ"}
            </span>
            <span className="text-[11px] text-muted-foreground">
              โปรโมชั่นจากร้าน
            </span>
          </div>
          <h3
            className={`mt-2 font-semibold leading-snug text-foreground ${
              compact ? "line-clamp-2 text-base" : "text-lg"
            }`}
          >
            {campaign.title}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold tracking-tight text-destructive">
            {benefitLabel(campaign)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            ราคาพิเศษ
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {!compact && campaign.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {campaign.description}
          </p>
        )}

        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {formatDate(campaign.startsAt)} – {formatDate(campaign.endsAt)}
          </p>
          <p className="flex items-center gap-2">
            {campaign.categoryCount > 0 ? (
              <Tags className="h-3.5 w-3.5 text-primary" />
            ) : (
              <PackageOpen className="h-3.5 w-3.5 text-primary" />
            )}
            {targetCount > 0
              ? `ครอบคลุม ${targetCount} กลุ่มสินค้า`
              : "ดูสินค้าที่ร่วมรายการ"}
          </p>
        </div>

        <Link
          href={`/campaigns/${campaign.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          ดูสินค้าที่ร่วมรายการ
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
