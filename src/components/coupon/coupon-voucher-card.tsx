"use client";

import { cn } from "@/lib/utils";
import {
  formatCouponBenefit,
  formatCouponDate,
} from "@/lib/coupons/catalog";
import type { ClaimableCoupon, SavedCoupon } from "@/types";

interface CouponVoucherCardProps {
  coupon: ClaimableCoupon | SavedCoupon;
  claimed?: boolean;
  selected?: boolean;
  disabled?: boolean;
  detailed?: boolean;
  actionLabel?: string;
  secondaryLabel?: string;
  onAction?: () => void;
  onSelect?: () => void;
  className?: string;
}

export function CouponVoucherCard({
  coupon,
  claimed = false,
  selected = false,
  disabled = false,
  detailed = false,
  actionLabel,
  secondaryLabel,
  onAction,
  onSelect,
  className,
}: CouponVoucherCardProps) {
  const benefit = formatCouponBenefit(coupon);
  const starts = formatCouponDate(coupon.startsAt);
  const expires = formatCouponDate(coupon.expiresAt);
  const isSelectable = Boolean(onSelect);
  const appliesTo = coupon.appliesTo ?? "ทุกสินค้าในร้าน";

  const discountLabel =
    coupon.discountType === "fixed"
      ? `฿${coupon.discountValue.toLocaleString()}`
      : `${coupon.discountValue}%`;

  return (
    <div
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={isSelectable && !disabled ? onSelect : undefined}
      onKeyDown={
        isSelectable && !disabled
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-lg border bg-white p-4 transition-all",
        selected
          ? "border-primary shadow-sm"
          : "border-border hover:border-primary/30 hover:shadow-sm",
        disabled && "opacity-55",
        isSelectable && !disabled && "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {coupon.title ?? coupon.code}
            </h3>
            {coupon.badge && (
              <span className="text-[11px] text-muted-foreground">
                · {coupon.badge}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-primary">
              {discountLabel}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {coupon.discountType === "fixed" ? "ส่วนลด" : "ลดราคา"}
            </span>
          </div>

          <p className="mt-1 text-xs text-foreground">{benefit}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {coupon.description ?? benefit}
          </p>
        </div>

        {onAction && (
          <button
            type="button"
            disabled={disabled || claimed}
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
            className={cn(
              "h-9 flex-shrink-0 rounded-md px-3.5 text-xs font-semibold transition-colors",
              claimed
                ? "bg-slate-100 text-slate-500"
                : "bg-primary text-white hover:bg-primary/90 disabled:opacity-50",
            )}
          >
            {claimed ? "ใช้แล้ว" : actionLabel ?? "ใช้คูปอง"}
          </button>
        )}
      </div>

      {detailed ? (
        <div className="mt-3 grid gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-muted-foreground sm:grid-cols-2">
          <p>
            <span className="text-slate-500">ใช้ได้กับ</span>
            <br />
            <span className="text-foreground">{appliesTo}</span>
          </p>
          <p>
            <span className="text-slate-500">ระยะเวลา</span>
            <br />
            <span className="text-foreground">
              {starts} – {expires}
            </span>
          </p>
          <p className="sm:col-span-2">
            <span className="text-slate-500">โค้ด</span>{" "}
            <span className="font-semibold text-foreground">{coupon.code}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span className="text-slate-500">หมดอายุ</span>{" "}
            <span className="text-foreground">{expires}</span>
          </p>
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-muted-foreground">
          โค้ด {coupon.code}
          <span className="mx-1.5 text-slate-300">·</span>
          หมดอายุ {expires}
          {secondaryLabel ? (
            <>
              <span className="mx-1.5 text-slate-300">·</span>
              {secondaryLabel}
            </>
          ) : null}
        </p>
      )}

      {detailed && secondaryLabel && !onAction && (
        <p className="mt-2 text-[11px] font-medium text-primary">
          {secondaryLabel}
        </p>
      )}
    </div>
  );
}
