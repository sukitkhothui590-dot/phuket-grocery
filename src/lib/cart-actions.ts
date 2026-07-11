import {
  addCartItem,
  clearServerCart,
  getServerCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { getProducts } from "@/lib/api/products";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { getAccessToken } from "@/lib/api/token";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import type { Product, ProductUnit } from "@/types";

function mapServerCartItem(item: {
  productUnitId: string;
  productId?: string;
  productName?: string;
  unitName?: string;
  unitPrice?: number;
  quantity: number;
  available: boolean;
}, product?: Product, unit?: ProductUnit): CartItem {
  return {
    productId: product?.id ?? item.productId ?? item.productUnitId,
    productName: product?.name ?? item.productName ?? "สินค้า",
    productImage:
      product?.images[0] ??
      getPlaceholderUrl(120, 120, product?.name ?? item.productName ?? "สินค้า"),
    selectedUnit: unit ?? {
      id: item.productUnitId,
      unitType: "piece",
      labelTh: item.unitName ?? "ชิ้น",
      labelEn: item.unitName ?? "piece",
      price: item.unitPrice ?? 0,
      conversionRate: 1,
      sku: item.productUnitId,
      stock: item.available ? 999 : 0,
    },
    quantity: item.quantity,
  };
}

async function enrichServerCartItems(
  items: Array<{
    productUnitId: string;
    productId?: string;
    productName?: string;
    unitName?: string;
    unitPrice?: number;
    quantity: number;
    available: boolean;
  }>,
): Promise<CartItem[]> {
  if (items.length === 0) {
    return [];
  }

  const { products } = await getProducts({ limit: 100 });

  return items.map((item) => {
    for (const product of products) {
      const unit = product.units.find(
        (productUnit) => productUnit.id === item.productUnitId,
      );
      if (unit) {
        return mapServerCartItem(item, product, unit);
      }
    }

    return mapServerCartItem(item);
  });
}

export async function loadCartFromServer() {
  const token = getAccessToken();
  if (!token) return;

  const response = await getServerCart(token);
  if (!response.success) return;

  const serverItems = await enrichServerCartItems(response.data.items);
  const localItems = useCartStore.getState().items;

  const items = serverItems.map((item) => {
    const local = localItems.find(
      (localItem) =>
        localItem.productId === item.productId &&
        localItem.selectedUnit.sku === item.selectedUnit.sku,
    );

    if (!local) return item;

    return {
      ...item,
      sourceLabel: local.sourceLabel ?? item.sourceLabel,
      promoDiscountPercent:
        local.promoDiscountPercent ?? item.promoDiscountPercent,
      promoSavedAmount: local.promoSavedAmount ?? item.promoSavedAmount,
    };
  });

  useCartStore.setState({ items });
}

export async function addToCart(item: CartItem) {
  useCartStore.getState().addItem(item);

  const token = getAccessToken();
  const unitId = item.selectedUnit.id;
  if (token && unitId) {
    await addCartItem(token, unitId, item.quantity);
  }
}

export async function setCartQuantity(
  productId: string,
  sku: string,
  quantity: number,
  unitId?: string,
) {
  useCartStore.getState().updateQuantity(productId, sku, quantity);

  const token = getAccessToken();
  if (!token || !unitId) return;

  if (quantity <= 0) {
    await removeCartItem(token, unitId);
    return;
  }

  await updateCartItem(token, unitId, quantity);
}

export async function removeFromCart(
  productId: string,
  sku: string,
  unitId?: string,
) {
  useCartStore.getState().removeItem(productId, sku);

  const token = getAccessToken();
  if (token && unitId) {
    await removeCartItem(token, unitId);
  }
}

export async function changeCartUnit(
  productId: string,
  oldSku: string,
  newUnit: ProductUnit,
  quantity: number,
) {
  const token = getAccessToken();
  const oldItem = useCartStore
    .getState()
    .items.find(
      (item) =>
        item.productId === productId && item.selectedUnit.sku === oldSku,
    );

  useCartStore.getState().updateUnit(productId, oldSku, newUnit);

  if (!token) return;

  if (oldItem?.selectedUnit.id) {
    await removeCartItem(token, oldItem.selectedUnit.id);
  }

  if (newUnit.id) {
    await addCartItem(token, newUnit.id, quantity);
  }
}

export async function clearCartEverywhere() {
  useCartStore.getState().clearCart();

  const token = getAccessToken();
  if (token) {
    await clearServerCart(token);
  }
}

export async function syncLocalCartToServer() {
  const token = getAccessToken();
  if (!token) return;

  const items = useCartStore.getState().items;
  await clearServerCart(token);

  for (const item of items) {
    const unitId = item.selectedUnit.id;
    if (!unitId) continue;
    await addCartItem(token, unitId, item.quantity);
  }
}
