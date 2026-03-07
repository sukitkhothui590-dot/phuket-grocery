import type { Address } from "./order";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  createdAt: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  address: Omit<Address, "id" | "isDefault">;
}
