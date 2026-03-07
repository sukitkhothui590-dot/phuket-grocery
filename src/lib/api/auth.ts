import { users } from "@/lib/mock-data";
import type { User, LoginCredentials, RegisterData } from "@/types";

export async function login(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: User; error?: string }> {
  const user = users.find(
    (u) =>
      u.email === credentials.emailOrPhone ||
      u.phone === credentials.emailOrPhone
  );

  if (!user) {
    return { success: false, error: "ไม่พบบัญชีผู้ใช้นี้" };
  }

  return { success: true, user };
}

export async function register(
  _data: RegisterData
): Promise<{ success: boolean; user?: User; error?: string }> {
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: _data.email,
    phone: _data.phone,
    firstName: _data.firstName,
    lastName: _data.lastName,
    addresses: [
      {
        ..._data.address,
        id: `addr-${Date.now()}`,
        isDefault: true,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  return { success: true, user: newUser };
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) ?? null;
}
