import {
  addCartItem,
  clearServerCart,
  getServerCart,
  removeCartItem,
  type ServerCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { getProducts } from "@/lib/api/products";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { getAccessToken } from "@/lib/api/token";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import type { Product, ProductUnit } from "@/types";

function mapServerCartItem(
  item: ServerCartItem,
  product?: Product,
  unit?: ProductUnit,
): CartItem {
  const selectedUnit: ProductUnit = unit
    ? {
        ...unit,
        price: item.unitPrice ?? unit.price,
        dealId: item.dealId ?? unit.dealId,
      }
    : {
        id: item.productUnitId,
        unitType: "piece",
        labelTh: item.unitName ?? "ชิ้น",
        labelEn: item.unitName ?? "piece",
        price: item.unitPrice ?? 0,
        conversionRate: 1,
        sku: item.productUnitId,
        stock: item.available ? 999 : 0,
        dealId: item.dealId ?? undefined,
      };
  const hasDiscount =
    selectedUnit.compareAtPrice !== undefined &&
    selectedUnit.compareAtPrice > selectedUnit.price;
  const dealTitle = item.dealTitle ?? product?.activeDeal?.title ?? undefined;

  return {
    productId: product?.id ?? item.productId ?? item.productUnitId,
    productName: product?.name ?? item.productName ?? "สินค้า",
    productImage:
      product?.images[0] ??
      getPlaceholderUrl(120, 120, product?.name ?? item.productName ?? "สินค้า"),
    selectedUnit,
    quantity: item.quantity,
    dealId: item.dealId ?? product?.activeDeal?.id ?? undefined,
    dealBadge:
      item.dealBadge ??
      product?.activeDeal?.badge ??
      product?.activeDeal?.title ??
      undefined,
    dealTitle,
    dealSlug: item.dealSlug ?? product?.activeDeal?.slug ?? undefined,
    sourceLabel: dealTitle ? "แคมเปญ" : undefined,
    promoDiscountPercent: hasDiscount
      ? Math.round(
          ((selectedUnit.compareAtPrice! - selectedUnit.price) /
            selectedUnit.compareAtPrice!) *
            100,
        )
      : undefined,
    promoSavedAmount: hasDiscount
      ? selectedUnit.compareAtPrice! - selectedUnit.price
      : undefined,
    lineTotal: item.lineTotal,
  };
}

async function enrichServerCartItems(
  items: ServerCartItem[],
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
      dealId: item.dealId ?? local.dealId,
      dealBadge: item.dealBadge ?? local.dealBadge,
      dealTitle: item.dealTitle ?? local.dealTitle,
      dealSlug: item.dealSlug ?? local.dealSlug,
      lineTotal: item.lineTotal,
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
    await loadCartFromServer();
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
  await loadCartFromServer();
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
  await loadCartFromServer();
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
