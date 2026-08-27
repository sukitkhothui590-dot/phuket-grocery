import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const STOREFRONT_PAGE_SIZE = 24;

export function parsePage(raw: string | undefined | null): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function buildPageHref(
  pathname: string,
  query: Record<string, string | undefined | null> | undefined,
  page: number,
): string {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (key === "page") continue;
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  const href = qs ? `${pathname}?${qs}` : pathname;
  return `${href}#product-results`;
}

function pageItems(current: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push("...");
  pages.push(totalPages);
  return pages;
}

interface ProductPaginationProps {
  pathname: string;
  query?: Record<string, string | undefined | null>;
  page: number;
  limit: number;
  total: number;
}

export function ProductPagination({
  pathname,
  query,
  page,
  limit,
  total,
}: ProductPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (total === 0 || totalPages <= 1) return null;

  const current = Math.min(page, totalPages);
  const start = (current - 1) * limit + 1;
  const end = Math.min(current * limit, total);

  return (
    <nav
      aria-label="หน้าสินค้า"
      className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        แสดง {start.toLocaleString()}–{end.toLocaleString()} จาก{" "}
        {total.toLocaleString()} รายการ
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {current > 1 ? (
          <Link
            href={buildPageHref(pathname, query, current - 1)}
            aria-label="หน้าก่อนหน้า"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {pageItems(current, totalPages).map((item, index) =>
          item === "..." ? (
            <span
              key={`dots-${index}`}
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Link
              key={item}
              href={buildPageHref(pathname, query, item)}
              aria-label={`หน้า ${item}`}
              aria-current={item === current ? "page" : undefined}
              className={cn(
                "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium",
                item === current
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted",
              )}
            >
              {item}
            </Link>
          ),
        )}

        {current < totalPages ? (
          <Link
            href={buildPageHref(pathname, query, current + 1)}
            aria-label="หน้าถัดไป"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
