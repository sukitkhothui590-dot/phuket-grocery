import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductUnit, Coupon } from "@/types";

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedUnit: ProductUnit;
  quantity: number;
  /** Where the item was added from, e.g. "ดีลพิเศษ" */
  sourceLabel?: string;
  /** Discount percent when added from a promo */
  promoDiscountPercent?: number;
  /** Saved amount per unit when added from a promo */
  promoSavedAmount?: number;
  /** Campaign pricing metadata returned by the catalog/cart API. */
  dealId?: string;
  dealBadge?: string;
  dealTitle?: string;
  dealSlug?: string;
  /** Authoritative priced line total returned by the server cart. */
  lineTotal?: number;
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  discount: number;

  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sku: string) => void;
  updateQuantity: (productId: string, sku: string, quantity: number) => void;
  updateUnit: (productId: string, oldSku: string, newUnit: ProductUnit) => void;
  clearCart: () => void;

  applyCoupon: (coupon: Coupon, subtotal: number, discountAmount?: number) => void;
  removeCoupon: () => void;

  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discount: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.selectedUnit.sku === item.selectedUnit.sku
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                i.selectedUnit.sku === item.selectedUnit.sku
                  ? {
                      ...i,
                      quantity: i.quantity + item.quantity,
                      sourceLabel: item.sourceLabel ?? i.sourceLabel,
                      promoDiscountPercent:
                        item.promoDiscountPercent ?? i.promoDiscountPercent,
                      promoSavedAmount:
                        item.promoSavedAmount ?? i.promoSavedAmount,
                      dealId: item.dealId ?? i.dealId,
                      dealBadge: item.dealBadge ?? i.dealBadge,
                      dealTitle: item.dealTitle ?? i.dealTitle,
                      dealSlug: item.dealSlug ?? i.dealSlug,
                      lineTotal: undefined,
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, sku) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedUnit.sku === sku)
          ),
        }));
      },

      updateQuantity: (productId, sku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, sku);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.selectedUnit.sku === sku
              ? { ...i, quantity, lineTotal: undefined }
              : i
          ),
        }));
      },

      updateUnit: (productId, oldSku, newUnit) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.selectedUnit.sku === oldSku
              ? { ...i, selectedUnit: newUnit, lineTotal: undefined }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      applyCoupon: (coupon, subtotal, discountAmount) => {
        let discount: number;
        if (typeof discountAmount === "number") {
          discount = discountAmount;
        } else if (coupon.discountType === "fixed") {
          discount = coupon.discountValue;
        } else {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        }
        set({ coupon, discount });
      },

      removeCoupon: () => set({ coupon: null, discount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) =>
            sum +
            (item.lineTotal ?? item.selectedUnit.price * item.quantity),
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().discount);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: "phuket-grocery-cart" }
  )
);
