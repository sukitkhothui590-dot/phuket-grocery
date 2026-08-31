import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { createAddress, getAddresses } from "@/lib/api/addresses";
import { mapUser } from "@/lib/api/mappers";
import type { LoginCredentials, RegisterData, User } from "@/types";

interface AuthPayload {
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(
  credentials: LoginCredentials,
): Promise<{
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}> {
  const response = await apiPost<AuthPayload>("/auth/login", {
    identifier: credentials.emailOrPhone,
    password: credentials.password,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "เข้าสู่ระบบไม่สำเร็จ",
    };
  }

  const user = mapUser(response.data.user);
  user.addresses = await getAddresses(response.data.tokens.accessToken);

  return {
    success: true,
    user,
    accessToken: response.data.tokens.accessToken,
    refreshToken: response.data.tokens.refreshToken,
  };
}

export async function register(
  data: RegisterData,
): Promise<{
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}> {
  const response = await apiPost<AuthPayload>("/auth/register", {
    name: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    phone: data.phone,
    password: data.password,
  });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "สมัครสมาชิกไม่สำเร็จ",
    };
  }

  const user = mapUser(response.data.user);
  const accessToken = response.data.tokens.accessToken;

  const addressResult = await createAddress(accessToken, {
    label: data.address.label,
    fullName: data.address.fullName,
    phone: data.address.phone,
    addressLine1: data.address.addressLine1,
    addressLine2: data.address.addressLine2,
    subDistrict: data.address.subDistrict,
    district: data.address.district,
    province: data.address.province,
    postalCode: data.address.postalCode,
    isDefault: true,
  });

  user.addresses = addressResult.success && addressResult.address
    ? [addressResult.address]
    : await getAddresses(accessToken);

  return {
    success: true,
    user,
    accessToken,
    refreshToken: response.data.tokens.refreshToken,
  };
}

export async function getCurrentUser(
  token: string,
): Promise<User | null> {
  const response = await apiGet<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
  }>("/users/me", { token });

  if (!response.success) {
    return null;
  }

  const user = mapUser(response.data);
  user.addresses = await getAddresses(token);

  return user;
}

export async function getUserById(
  id: string,
  token?: string,
): Promise<User | null> {
  if (!token) {
    return null;
  }

  const user = await getCurrentUser(token);
  if (!user || user.id !== id) {
    return null;
  }

  return user;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiPost("/auth/logout", { refreshToken });
}

export async function updateProfile(
  token: string,
  data: { name: string; phone?: string; email?: string },
): Promise<{ success: boolean; user?: User; error?: string }> {
  const response = await apiPatch<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
  }>("/users/me", data, { token });

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "บันทึกข้อมูลไม่สำเร็จ",
    };
  }

  return {
    success: true,
    user: mapUser(response.data),
  };
}

export async function requestPasswordReset(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await apiPost<{ message?: string }>(
    "/auth/forgot-password",
    { email },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้",
    };
  }

  return { success: true };
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  const response = await apiPost<{ message?: string }>(
    "/auth/reset-password",
    { token, password },
  );

  if (!response.success) {
    return {
      success: false,
      error: response.error.message || "ไม่สามารถรีเซ็ตรหัสผ่านได้",
    };
  }

  return { success: true };
}
