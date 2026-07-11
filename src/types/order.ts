import type { ProductUnit } from "./product";

export type OrderStatus =
  | "pending_payment"
  | "pending_verify"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "bank_transfer" | "cod";

export type ShippingMethod = "standard" | "express";

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedUnit: ProductUnit;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  slipImage?: string;
  slipUploadedAt?: string;
  shippingAddress: Address;
  couponCode?: string;
  discount: number;
  shippingCost: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  district: string;
  subDistrict: string;
  province: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch?: string;
}
