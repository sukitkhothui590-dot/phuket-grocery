"use client";

import type { Order } from "@/types";

function isOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeOrder = value as Partial<Order>;
  return (
    typeof maybeOrder.id === "string" &&
    typeof maybeOrder.orderNumber === "string" &&
    Array.isArray(maybeOrder.items) &&
    typeof maybeOrder.status === "string"
  );
}

function normalizeSessionOrder(order: Order): Order {
  if (
    order.status !== "pending_payment" &&
    order.status !== "pending_verify"
  ) {
    return order;
  }

  return {
    ...order,
    status: "preparing",
    updatedAt: new Date().toISOString(),
  };
}

export function getSessionOrders(): Order[] {
  if (typeof window === "undefined") {
    return [];
  }

  const orders: Order[] = [];

  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (!key || !key.startsWith("order-")) {
        continue;
      }

      const raw = window.sessionStorage.getItem(key);
      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw) as unknown;
      if (isOrder(parsed)) {
        const normalizedOrder = normalizeSessionOrder(parsed);
        orders.push(normalizedOrder);
        if (normalizedOrder.status !== parsed.status) {
          window.sessionStorage.setItem(key, JSON.stringify(normalizedOrder));
        }
      }
    }
  } catch {
    return [];
  }

  return orders;
}

export function mergeOrders(baseOrders: Order[], sessionOrders: Order[]) {
  const merged = new Map<string, Order>();

  for (const order of [...baseOrders, ...sessionOrders]) {
    merged.set(order.id, order);
  }

  return [...merged.values()].sort((left, right) => {
    return (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  });
}
