"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Store, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponPicker } from "@/components/coupon/coupon-picker";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  changeCartUnit,
  removeFromCart,
  setCartQuantity,
} from "@/lib/cart-actions";
import { validateCoupon } from "@/lib/api/orders";
import { getProductById } from "@/lib/api/products";
import { COMPANY_INFO } from "@/lib/constants";
import { getPlaceholderUrl } from "@/lib/placeholder";
import type { Product, ProductUnit } from "@/types";

function getProductUnits(product?: Product): ProductUnit[] {
  return product?.units ?? [];
}

function getSelectionKey(productId: string, sku: string) {
  return `${productId}-${sku}`;
}

export default function CartPage() {
  const {
    items,
    coupon,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponPickerOpen, setCouponPickerOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});

  useEffect(() => {
    const nextKeys = items.map((item) =>
      getSelectionKey(item.productId, item.selectedUnit.sku)
    );

    setSelectedKeys((current) => {
      const filtered = current.filter((key) => nextKeys.includes(key));
      return filtered.length > 0 ? filtered : nextKeys;
    });
  }, [items]);

  useEffect(() => {
    async function loadProducts() {
      const uniqueIds = [...new Set(items.map((item) => item.productId))];

      const entries = await Promise.all(
        uniqueIds.map(async (productId) => {
          const product = await getProductById(productId);
          return product ? ([productId, product] as const) : null;
        }),
      );

      const nextEntries = entries.filter(
        (entry): entry is readonly [string, Product] => entry !== null,
      );

      if (nextEntries.length > 0) {
        setProductCache((current) => {
          const updates = Object.fromEntries(
            nextEntries.filter(([productId]) => !current[productId]),
          );

          if (Object.keys(updates).length === 0) {
            return current;
          }

          return { ...current, ...updates };
        });
      }
    }

    void loadProducts();
  }, [items]);

  const selectedItems = items.filter((item) =>
    selectedKeys.includes(getSelectionKey(item.productId, item.selectedUnit.sku))
  );
  const selectedCount = selectedItems.length;
  const allSelected = items.length > 0 && selectedCount === items.length;
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.selectedUnit.price * item.quantity,
    0
  );
  const appliedDiscount = coupon ? Math.min(discount, subtotal) : 0;
  const total = Math.max(0, subtotal - appliedDiscount);

  const toggleItemSelection = (productId: string, sku: string) => {
    const key = getSelectionKey(productId, sku);
    setSelectedKeys((current) =>
      current.includes(key)
        ? current.filter((itemKey) => itemKey !== key)
        : [...current, key]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys([]);
      return;
    }

    setSelectedKeys(
      items.map((item) => getSelectionKey(item.productId, item.selectedUnit.sku))
    );
  };

  const handleApplyCoupon = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setCouponLoading(true);
    setCouponError("");

    if (selectedItems.length === 0) {
      setCouponError("กรุณาเลือกสินค้าก่อนใช้โค้ดส่วนลด");
      setCouponLoading(false);
      return;
    }

    const couponItems = selectedItems
      .filter((item) => item.selectedUnit.id)
      .map((item) => ({
        productId: item.productId,
        unitId: item.selectedUnit.id!,
        quantity: item.quantity,
      }));

    if (couponItems.length === 0) {
      setCouponError("ไม่พบหน่วยสินค้าสำหรับตรวจสอบโค้ด กรุณาลองเพิ่มสินค้าใหม่");
      setCouponLoading(false);
      return;
    }

    const result = await validateCoupon(
      trimmed,
      subtotal,
      couponItems,
      accessToken,
    );
    if (result.valid && result.coupon) {
      applyCoupon(result.coupon, subtotal, result.discount);
      setCouponPickerOpen(false);
      setCouponError("");
    } else {
      setCouponError(result.error ?? "โค้ดส่วนลดไม่ถูกต้อง");
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
        <Button
          className="mt-6"
          nativeButton={false}
          render={<Link href="/categories" />}
        >
          เลือกซื้อสินค้า
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] pb-28">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="hidden rounded-sm border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500 shadow-[0_1px_1px_rgba(15,23,42,0.03)] lg:grid lg:grid-cols-[48px_minmax(0,1fr)_140px_170px_140px_120px] lg:items-center">
          <div>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              aria-label="เลือกสินค้าทั้งหมด"
            />
          </div>
          <div>สินค้า</div>
          <div className="text-center">ราคาต่อชิ้น</div>
          <div className="text-center">จำนวน</div>
          <div className="text-center">ราคารวม</div>
          <div className="text-center">แอ็กชัน</div>
        </div>

        <div className="mt-4 space-y-4">
          {items.map((item) => {
            const product = productCache[item.productId];
            const availableUnits = getProductUnits(product);
            const itemSubtotal = item.selectedUnit.price * item.quantity;
            const selected = selectedKeys.includes(
              getSelectionKey(item.productId, item.selectedUnit.sku)
            );

            return (
              <section
                key={getSelectionKey(item.productId, item.selectedUnit.sku)}
                className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_1px_1px_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleItemSelection(item.productId, item.selectedUnit.sku)
                    }
                    aria-label={`เลือกสินค้า ${item.productName}`}
                  />
                  <Store className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {COMPANY_INFO.shortName}
                  </span>
                </div>

                <div className="grid gap-4 px-4 py-6 lg:grid-cols-[48px_minmax(0,1fr)_140px_170px_140px_120px] lg:items-center">
                  <div className="hidden lg:flex lg:justify-center">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleItemSelection(item.productId, item.selectedUnit.sku)
                      }
                      aria-label={`เลือกสินค้า ${item.productName}`}
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-slate-200 bg-muted">
                      <img
                        src={
                          item.productImage ||
                          getPlaceholderUrl(96, 96, item.productName)
                        }
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={product ? `/products/${product.slug}` : "/categories"}
                        className="line-clamp-2 text-sm font-medium leading-6 text-foreground hover:text-primary"
                      >
                        {item.productName}
                      </Link>

                      {(item.sourceLabel ||
                        item.promoDiscountPercent ||
                        item.promoSavedAmount) && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {item.sourceLabel && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                              <Tag className="h-3 w-3" />
                              จาก {item.sourceLabel}
                            </span>
                          )}
                          {typeof item.promoDiscountPercent === "number" && (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-destructive ring-1 ring-destructive/10">
                              ลด {item.promoDiscountPercent}%
                            </span>
                          )}
                          {typeof item.promoSavedAmount === "number" &&
                            item.promoSavedAmount > 0 && (
                              <span className="text-[11px] font-medium text-destructive">
                                ประหยัด ฿
                                {(
                                  item.promoSavedAmount * item.quantity
                                ).toLocaleString()}
                              </span>
                            )}
                        </div>
                      )}

                      {availableUnits.length > 1 ? (
                        <div className="mt-3">
                          <label className="text-xs text-muted-foreground">
                            ตัวเลือกสินค้า
                          </label>
                          <select
                            value={item.selectedUnit.sku}
                            onChange={(e) => {
                              const newUnit = availableUnits.find(
                                (unit) => unit.sku === e.target.value
                              );
                              if (newUnit) {
                                void changeCartUnit(
                                  item.productId,
                                  item.selectedUnit.sku,
                                  newUnit,
                                  item.quantity,
                                );
                              }
                            }}
                            className="mt-1 block h-9 w-full max-w-[240px] rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            {availableUnits.map((unit) => (
                              <option key={unit.sku} value={unit.sku}>
                                {unit.labelTh} - ฿{unit.price.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="mt-3 text-xs text-muted-foreground">
                          {item.selectedUnit.labelTh}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-[#ee4d2d]">
                        เหลือสินค้าอยู่ {item.selectedUnit.stock} ชิ้น
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm lg:block lg:text-center">
                    <span className="text-muted-foreground lg:hidden">ราคาต่อชิ้น</span>
                    <div className="lg:flex lg:flex-col lg:items-center">
                      <span className="text-foreground">
                        ฿{item.selectedUnit.price.toLocaleString()}
                      </span>
                      {item.selectedUnit.compareAtPrice &&
                        item.selectedUnit.compareAtPrice >
                          item.selectedUnit.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ฿
                            {item.selectedUnit.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-center">
                    <span className="text-sm text-muted-foreground lg:hidden">จำนวน</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          void setCartQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            item.quantity - 1,
                            item.selectedUnit.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          void setCartQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            Number(e.target.value) || 1,
                            item.selectedUnit.id,
                          )
                        }
                        className="h-9 w-12 border-y border-slate-300 text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          void setCartQuantity(
                            item.productId,
                            item.selectedUnit.sku,
                            item.quantity + 1,
                            item.selectedUnit.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:block lg:text-center">
                    <span className="text-sm text-muted-foreground lg:hidden">ราคารวม</span>
                    <span className="text-base font-semibold text-destructive">
                      ฿{itemSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between lg:flex-col lg:gap-2">
                    <span className="text-sm text-muted-foreground lg:hidden">แอ็กชัน</span>
                    <button
                      type="button"
                      onClick={() =>
                        void removeFromCart(
                          item.productId,
                          item.selectedUnit.sku,
                          item.selectedUnit.id,
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      ลบ
                    </button>
                  </div>
                </div>
              </section>
            );
          })}

          <section className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_1px_1px_rgba(15,23,42,0.03)]">
            <div className="bg-[#fcfcfc] px-4 py-4 text-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 text-foreground">
                  <Tag className="h-4 w-4 text-destructive" />
                  <span className="font-medium">โค้ดส่วนลด / คูปอง</span>
                </div>

                {coupon ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      ใช้งานโค้ด {coupon.code}
                      {appliedDiscount > 0
                        ? ` (−฿${appliedDiscount.toLocaleString()})`
                        : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCouponPickerOpen(true)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      เปลี่ยน
                    </button>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-slate-500 transition-colors hover:text-destructive"
                    >
                      ลบคูปอง
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-9 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => {
                        setCouponError("");
                        setCouponPickerOpen(true);
                      }}
                    >
                      เลือกคูปอง / ใส่โค้ด
                    </Button>
                    <Link
                      href="/coupons"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      เก็บคูปอง
                    </Link>
                  </div>
                )}
              </div>

              {couponError && !couponPickerOpen && (
                <p className="mt-2 text-xs text-destructive">{couponError}</p>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                aria-label="เลือกสินค้าทั้งหมด"
              />
              <span>เลือกทั้งหมด ({items.length})</span>
            </label>

            <button
              type="button"
              onClick={() => {
                selectedItems.forEach((item) => {
                  void removeFromCart(
                    item.productId,
                    item.selectedUnit.sku,
                    item.selectedUnit.id,
                  );
                });
              }}
              className="text-sm text-slate-500 transition-colors hover:text-destructive"
            >
              ลบสินค้าที่เลือก
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-6">
            <div className="text-right text-sm">
              <p className="text-muted-foreground">
                รวม ({selectedCount} สินค้า)
                {appliedDiscount > 0 && (
                  <span className="ml-2 text-green-600">
                    ลดแล้ว ฿{appliedDiscount.toLocaleString()}
                  </span>
                )}
              </p>
              <p className="text-2xl font-bold text-destructive">
                ฿{total.toLocaleString()}
              </p>
            </div>

            <Button
              size="lg"
              className="h-12 min-w-[220px] rounded-sm bg-destructive text-base font-semibold text-white hover:bg-destructive/90"
              nativeButton={false}
              render={<Link href="/checkout" />}
            >
              สั่งสินค้า
            </Button>
          </div>
        </div>
      </div>

      <CouponPicker
        open={couponPickerOpen}
        onClose={() => setCouponPickerOpen(false)}
        onApplyCode={handleApplyCoupon}
        loading={couponLoading}
        error={couponError}
        appliedCode={coupon?.code}
      />
    </div>
  );
}
