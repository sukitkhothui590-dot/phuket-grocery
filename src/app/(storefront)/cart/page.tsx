"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { validateCoupon } from "@/lib/api/orders";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { products as allProducts } from "@/lib/mock-data";
import type { ProductUnit } from "@/types";

function getProductUnits(productId: string): ProductUnit[] {
  return allProducts.find((p) => p.id === productId)?.units ?? [];
}

export default function CartPage() {
  const {
    items,
    coupon,
    discount,
    updateQuantity,
    updateUnit,
    removeItem,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");

    const result = await validateCoupon(couponCode.trim(), subtotal);
    if (result.valid && result.coupon) {
      applyCoupon(result.coupon, subtotal);
      setCouponCode("");
    } else {
      setCouponError(result.error ?? "โค้ดไม่ถูกต้อง");
    }
    setCouponLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 text-xl font-bold text-foreground">ตะกร้าว่างเปล่า</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          คุณยังไม่มีสินค้าในตะกร้า
        </p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/categories" />}>
          เลือกซื้อสินค้า
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground">ตะกร้าสินค้า</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} รายการ</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item) => {
            const availableUnits = getProductUnits(item.productId);
            const itemSubtotal = item.selectedUnit.price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.selectedUnit.sku}`}
                className="flex gap-4 rounded-lg border bg-white p-4"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    src={
                      item.productImage ||
                      getPlaceholderUrl(80, 80, item.productName)
                    }
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                      {item.productName}
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.productId, item.selectedUnit.sku)
                      }
                      className="flex-shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Unit selector dropdown */}
                  {availableUnits.length > 1 ? (
                    <select
                      value={item.selectedUnit.sku}
                      onChange={(e) => {
                        const newUnit = availableUnits.find(
                          (u) => u.sku === e.target.value
                        );
                        if (newUnit)
                          updateUnit(
                            item.productId,
                            item.selectedUnit.sku,
                            newUnit
                          );
                      }}
                      className="h-7 w-fit rounded-md border border-input bg-white px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {availableUnits.map((u) => (
                        <option key={u.sku} value={u.sku}>
                          {u.labelTh} — ฿{u.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {item.selectedUnit.labelTh}
                    </span>
                  )}

                  {/* Quantity & Subtotal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            item.quantity - 1
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            Number(e.target.value) || 1
                          )
                        }
                        className="h-7 w-12 rounded-md border border-input bg-transparent text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            item.quantity + 1
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-input transition-colors hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ฿{itemSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="h-fit space-y-4 rounded-lg border bg-white p-5">
          <h2 className="text-lg font-bold text-foreground">สรุปคำสั่งซื้อ</h2>

          {/* Coupon */}
          <div className="space-y-2">
            {coupon ? (
              <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {coupon.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                >
                  ลบ
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponError) setCouponError("");
                  }}
                  placeholder="โค้ดส่วนลด"
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                >
                  {couponLoading ? "..." : "ใช้โค้ด"}
                </Button>
              </div>
            )}
            {couponError && (
              <p className="text-xs text-destructive">{couponError}</p>
            )}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ยอดรวมสินค้า</span>
              <span className="text-foreground">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>ส่วนลด</span>
                <span>-฿{discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between text-base font-bold">
            <span>ยอดสุทธิ</span>
            <span className="text-primary">฿{total.toLocaleString()}</span>
          </div>

          <Button
            className="w-full"
            size="lg"
            nativeButton={false}
            render={<Link href="/checkout" />}
          >
            ดำเนินการสั่งซื้อ
          </Button>
        </div>
      </div>
    </div>
  );
}
