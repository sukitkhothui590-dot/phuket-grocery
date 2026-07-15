"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CouponVoucherCard } from "@/components/coupon/coupon-voucher-card";
import { getCouponsForCart } from "@/lib/api/coupons";
import { formatCouponBenefit } from "@/lib/coupons/catalog";
import type { CartCoupon } from "@/types";

interface CouponPickerProps {
  open: boolean;
  onClose: () => void;
  onApplyCode: (code: string) => Promise<void> | void;
  loading?: boolean;
  error?: string;
  appliedCode?: string;
  token?: string | null;
  cartItems: Array<{ productId: string; unitId: string; quantity: number }>;
}

export function CouponPicker({
  open,
  onClose,
  onApplyCode,
  loading = false,
  error,
  appliedCode,
  token,
  cartItems,
}: CouponPickerProps) {
  const [manualCode, setManualCode] = useState("");
  const [selectedCode, setSelectedCode] = useState(appliedCode ?? "");
  const [available, setAvailable] = useState<CartCoupon[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    void getCouponsForCart(cartItems, token).then((result) => {
      if (!cancelled) {
        setAvailable(result.coupons);
        setFetching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [appliedCode, cartItems, open, token]);

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
                คูปองสำหรับตะกร้านี้ ({available.length})
              </p>
              {available.map((coupon) => (
                <CouponVoucherCard
                  key={coupon.id}
                  coupon={coupon}
                  selected={
                    selectedCode.toUpperCase() === coupon.code.toUpperCase()
                  }
                  disabled={!coupon.applicable}
                  onSelect={() => {
                    setSelectedCode(coupon.code);
                    setManualCode("");
                  }}
                  secondaryLabel={
                    coupon.applicable
                      ? coupon.discountPreview > 0
                        ? `ลดได้ ฿${coupon.discountPreview.toLocaleString()}`
                        : formatCouponBenefit(coupon)
                      : coupon.message ?? formatCouponBenefit(coupon)
                  }
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
