import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { mapAddress } from "@/lib/api/mappers";
import type { Address } from "@/types";

interface BackendAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  subDistrict?: string | null;
  district?: string | null;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

function toBackendPayload(data: {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  subDistrict?: string;
  district?: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) {
  const addressLine = [data.addressLine1, data.addressLine2]
    .filter(Boolean)
    .join(" ");

  return {
    label: data.label ?? "",
    recipientName: data.fullName,
    phone: data.phone,
    addressLine,
    subDistrict: data.subDistrict,
    district: data.district,
    province: data.province,
    postalCode: data.postalCode,
    isDefault: data.isDefault,
  };
}

export async function getAddresses(token: string): Promise<Address[]> {
  const response = await apiGet<BackendAddress[]>("/users/me/addresses", {
    token,
  });

  if (!response.success) {
    return [];
  }

  return response.data.map(mapAddress);
}

export async function createAddress(
  token: string,
  data: Parameters<typeof toBackendPayload>[0],
): Promise<{ success: boolean; address?: Address; error?: string }> {
  const response = await apiPost<BackendAddress>(
    "/users/me/addresses",
    toBackendPayload(data),
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถเพิ่มที่อยู่ได้",
    };
  }

  return {
    success: true,
    address: mapAddress(response.data),
  };
}

export async function updateAddress(
  token: string,
  id: string,
  data: Parameters<typeof toBackendPayload>[0],
): Promise<{ success: boolean; address?: Address; error?: string }> {
  const response = await apiPatch<BackendAddress>(
    `/users/me/addresses/${id}`,
    toBackendPayload(data),
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถแก้ไขที่อยู่ได้",
    };
  }

  return {
    success: true,
    address: mapAddress(response.data),
  };
}

export async function deleteAddress(
  token: string,
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await apiDelete<null>(`/users/me/addresses/${id}`, {
    token,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถลบที่อยู่ได้",
    };
  }

  return { success: true };
}

export async function setDefaultAddress(
  token: string,
  id: string,
): Promise<{ success: boolean; address?: Address; error?: string }> {
  const response = await apiPost<BackendAddress>(
    `/users/me/addresses/${id}/default`,
    {},
    { token },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถตั้งค่าเริ่มต้นได้",
    };
  }

  return {
    success: true,
    address: mapAddress(response.data),
  };
}
