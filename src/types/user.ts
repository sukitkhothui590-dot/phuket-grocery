import type { Address } from "./order";

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  createdAt: string;
  memberCode?: string | null;
  memberCodeClaim?: string | null;
  customerType?: CustomerType | null;
}

export type CustomerType =
  | "บุคคล"
  | "ร้านค้า"
  | "ร้านอาหาร"
  | "โรงแรม"
  | "โรงเรียน"
  | "ที่ราชการ"
  | "อื่นๆ";

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
  memberCode?: string;
  customerType: CustomerType;
  address: Omit<Address, "id" | "isDefault">;
}
