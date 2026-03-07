import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductUnit, Coupon } from "@/types";

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedUnit: ProductUnit;
  quantity: number;
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

  applyCoupon: (coupon: Coupon, subtotal: number) => void;
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
                  ? { ...i, quantity: i.quantity + item.quantity }
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
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      updateUnit: (productId, oldSku, newUnit) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.selectedUnit.sku === oldSku
              ? { ...i, selectedUnit: newUnit }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      applyCoupon: (coupon, subtotal) => {
        let discount: number;
        if (coupon.discountType === "fixed") {
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
          (sum, item) => sum + item.selectedUnit.price * item.quantity,
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
