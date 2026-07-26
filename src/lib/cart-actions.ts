import {
  addCartItem,
  clearServerCart,
  getServerCart,
  removeCartItem,
  type ServerCartItem,
  updateCartItem,
} from "@/lib/api/cart";
import { getProductById, getProducts } from "@/lib/api/products";
import { getPlaceholderUrl } from "@/lib/placeholder";
import { getAccessToken } from "@/lib/api/token";
import { requireLogin } from "@/lib/auth-guard";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import type { Product, ProductUnit } from "@/types";

function clampQty(quantity: number, stock: number) {
  if (stock <= 0) return 0;
  return Math.max(0, Math.min(quantity, stock));
}

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
        // Never invent "999" stock — unknown becomes 0 when unavailable.
        stock: item.available ? Math.max(item.quantity, 0) : 0,
        dealId: item.dealId ?? undefined,
      };
  const hasDiscount =
    selectedUnit.compareAtPrice !== undefined &&
    selectedUnit.compareAtPrice > selectedUnit.price;
  const dealTitle = item.dealTitle ?? product?.activeDeal?.title ?? undefined;
  const productImage =
    product?.images.find((img) => !!img) ??
    getPlaceholderUrl(120, 120, product?.name ?? item.productName ?? "สินค้า");

  return {
    productId: product?.id ?? item.productId ?? item.productUnitId,
    productName: product?.name ?? item.productName ?? "สินค้า",
    productImage,
    selectedUnit,
    quantity: clampQty(item.quantity, selectedUnit.stock),
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
  const byUnitId = new Map<string, { product: Product; unit: ProductUnit }>();
  for (const product of products) {
    for (const unit of product.units) {
      if (!unit.id) continue;
      byUnitId.set(unit.id, { product, unit });
    }
  }

  return Promise.all(
    items.map(async (item) => {
      const hit = byUnitId.get(item.productUnitId);
      if (hit) {
        return mapServerCartItem(item, hit.product, hit.unit);
      }

      if (item.productId) {
        const product = await getProductById(item.productId);
        const unit = product?.units.find((u) => u.id === item.productUnitId);
        if (product && unit) {
          return mapServerCartItem(item, product, unit);
        }
        if (product) {
          return mapServerCartItem(item, product);
        }
      }

      return mapServerCartItem(item);
    }),
  );
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
      productImage:
        item.productImage ||
        local.productImage ||
        getPlaceholderUrl(120, 120, item.productName),
      sourceLabel: local.sourceLabel ?? item.sourceLabel,
      promoDiscountPercent:
        local.promoDiscountPercent ?? item.promoDiscountPercent,
      promoSavedAmount: local.promoSavedAmount ?? item.promoSavedAmount,
      dealId: item.dealId ?? local.dealId,
      dealBadge: item.dealBadge ?? local.dealBadge,
      dealTitle: item.dealTitle ?? local.dealTitle,
      dealSlug: item.dealSlug ?? local.dealSlug,
      lineTotal: item.lineTotal,
      selectedUnit: {
        ...item.selectedUnit,
        stock:
          item.selectedUnit.stock > 0
            ? item.selectedUnit.stock
            : local.selectedUnit.stock,
      },
      quantity: clampQty(
        item.quantity,
        item.selectedUnit.stock > 0
          ? item.selectedUnit.stock
          : local.selectedUnit.stock,
      ),
    };
  });

  useCartStore.setState({ items });
}

export type AddToCartResult =
  | { success: true }
  | { success: false; error: string };

export async function addToCart(item: CartItem): Promise<AddToCartResult> {
  if (!requireLogin()) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า" };
  }

  const existing = useCartStore
    .getState()
    .items.find(
      (cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.selectedUnit.sku === item.selectedUnit.sku,
    );
  const currentQty = existing?.quantity ?? 0;
  const stock = item.selectedUnit.stock;
  const nextQty = currentQty + item.quantity;

  if (stock <= 0) {
    return { success: false, error: "สินค้าหมดสต็อก" };
  }

  if (nextQty > stock) {
    return {
      success: false,
      error: `เหลือเพียง ${stock} ชิ้นในสต็อก`,
    };
  }

  useCartStore.getState().addItem({
    ...item,
    productImage:
      item.productImage ||
      getPlaceholderUrl(120, 120, item.productName),
    quantity: item.quantity,
  });

  const token = getAccessToken();
  const unitId = item.selectedUnit.id;
  if (token && unitId) {
    const response = await addCartItem(token, unitId, item.quantity);
    if (!response.success) {
      // Roll back optimistic add if server rejects (e.g. overstock).
      useCartStore
        .getState()
        .updateQuantity(item.productId, item.selectedUnit.sku, currentQty);
      return {
        success: false,
        error: response.error.message || "ไม่สามารถเพิ่มสินค้าลงตะกร้าได้",
      };
    }
    await loadCartFromServer();
  }

  return { success: true };
}

export async function setCartQuantity(
  productId: string,
  sku: string,
  quantity: number,
  unitId?: string,
  maxStock?: number,
) {
  const item = useCartStore
    .getState()
    .items.find(
      (cartItem) =>
        cartItem.productId === productId && cartItem.selectedUnit.sku === sku,
    );
  const stock = maxStock ?? item?.selectedUnit.stock ?? 0;
  const next = quantity <= 0 ? 0 : clampQty(quantity, stock);

  if (quantity > 0 && stock > 0 && quantity > stock) {
    // Still apply clamped value, but return false so UI can toast.
    useCartStore.getState().updateQuantity(productId, sku, next);
  } else {
    useCartStore.getState().updateQuantity(productId, sku, next);
  }

  const token = getAccessToken();
  if (!token || !unitId) {
    return { success: next === quantity || quantity <= 0, stock };
  }

  if (next <= 0) {
    await removeCartItem(token, unitId);
    return { success: true, stock };
  }

  const response = await updateCartItem(token, unitId, next);
  if (!response.success) {
    await loadCartFromServer();
    return {
      success: false,
      stock,
      error: response.error.message,
    };
  }
  await loadCartFromServer();
  return { success: true, stock };
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

  const nextQty = clampQty(quantity, newUnit.stock);
  useCartStore.getState().updateUnit(productId, oldSku, newUnit);
  if (nextQty !== quantity) {
    useCartStore.getState().updateQuantity(productId, newUnit.sku, nextQty);
  }

  if (!token) return;

  if (oldItem?.selectedUnit.id) {
    await removeCartItem(token, oldItem.selectedUnit.id);
  }

  if (newUnit.id && nextQty > 0) {
    await addCartItem(token, newUnit.id, nextQty);
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
    const qty = clampQty(item.quantity, item.selectedUnit.stock);
    if (qty <= 0) continue;
    await addCartItem(token, unitId, qty);
  }
}
