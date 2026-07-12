"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { getAvailableCoupons } from "@/lib/api/coupons";
import { formatCouponBenefit } from "@/lib/coupons/catalog";
import type { ClaimableCoupon } from "@/types";

interface CouponPickerProps {
  open: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => Promise<void> | void;
  loading?: boolean;
  error?: string;
  appliedCode?: string;
}

export function CouponPicker({
  open,
  onClose,
  onApplyCode,
  loading = false,
  error,
  appliedCode,
}: CouponPickerProps) {
  const [manualCode, setManualCode] = useState("");
  const [selectedCode, setSelectedCode] = useState(appliedCode ?? "");
  const [available, setAvailable] = useState<ClaimableCoupon[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedCode(appliedCode ?? "");
    setManualCode("");

    let cancelled = false;
    setFetching(true);
    void getAvailableCoupons().then((result) => {
      if (!cancelled) {
        setAvailable(result.coupons);
        setFetching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [appliedCode, open]);

  if (!open) return null;

  const handleConfirm = async () => {
    const code = selectedCode || manualCode.trim();
    if (!code) return;
    await onApplyCode(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-destructive" />
            <h2 className="text-base font-bold">เลือกคูปองส่วนลด</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-4 py-4">
          {fetching ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              กำลังโหลดคูปอง...
            </p>
          ) : available.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                ยังไม่มีคูปองพร้อมใช้ตอนนี้
              </p>
              <Link
                href="/coupons"
                className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
              >
                ดูคูปองทั้งหมด
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                คูปองพร้อมใช้ ({available.length})
              </p>
              {available.map((coupon) => (
                <CouponVoucherCard
                  key={coupon.id}
                  coupon={coupon}
                  selected={
                    selectedCode.toUpperCase() === coupon.code.toUpperCase()
                  }
                  onSelect={() => {
                    setSelectedCode(coupon.code);
                    setManualCode("");
                  }}
                  secondaryLabel={formatCouponBenefit(coupon)}
                />
              ))}
            </div>
          )}

          <div className="border-t pt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              หรือใส่โค้ดเอง
            </p>
            <Input
              value={manualCode}
              onChange={(event) => {
                setManualCode(event.target.value.toUpperCase());
                setSelectedCode("");
              }}
              placeholder="กรอกโค้ดส่วนลด"
              className="h-10"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex gap-2 border-t px-4 py-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            className="flex-1"
            disabled={loading || (!selectedCode && !manualCode.trim())}
            onClick={() => void handleConfirm()}
          >
            {loading ? "กำลังตรวจสอบ..." : "ใช้คูปองนี้"}
          </Button>
        </div>
      </div>
    </div>
  );
}
