import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";

export async function getServerCart(token: string) {
  return apiGet<{
    id: string;
    items: Array<{
      id: string;
      productUnitId: string;
      productId?: string;
      productName?: string;
      unitName?: string;
      unitPrice?: number;
      quantity: number;
      lineTotal?: number;
      available: boolean;
    }>;
    subtotal: number;
  }>("/cart", { token });
}

export async function addCartItem(
  token: string,
  unitId: string,
  quantity: number,
) {
  return apiPost("/cart/items", { unitId, quantity }, { token });
}

export async function updateCartItem(
  token: string,
  unitId: string,
  quantity: number,
) {
  return apiPatch(`/cart/items/${unitId}`, { quantity }, { token });
}

export async function removeCartItem(token: string, unitId: string) {
  return apiDelete(`/cart/items/${unitId}`, { token });
}

export async function clearServerCart(token: string) {
  return apiDelete("/cart", { token });
}

export async function syncCartToServer(
  token: string,
  items: Array<{ unitId: string; quantity: number }>,
) {
  await clearServerCart(token);

  for (const item of items) {
    if (!item.unitId) continue;
    await addCartItem(token, item.unitId, item.quantity);
  }
}
