import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiResponse } from "@/lib/api/client";
import { resolveMediaUrl } from "@/lib/api/media";

function buildUploadUrl(path: string) {
  // POST /backend/uploads (Nest controller under global prefix)
  const base = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const target = `${base}${normalizedPath}`;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.API_PROXY_TARGET ?? "http://localhost:3000";

  return target.startsWith("http://") || target.startsWith("https://")
    ? target
    : new URL(target, origin).toString();
}

async function uploadViaStorefront(
  file: File,
  token: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-slip", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = (await response.json()) as ApiResponse<{
    url?: string;
    path?: string;
  }>;

  if (!payload.success) {
    return {
      success: false,
      error: payload.error?.message ?? "อัปโหลดสลิปไม่สำเร็จ",
    };
  }

  return {
    success: true,
    url: payload.data.url ?? payload.data.path,
  };
}

/**
 * Upload an image. Prefers backend `/uploads`, but CUSTOMER role is currently
 * forbidden there — fall back to storefront slip storage for checkout.
 */
export async function uploadFile(
  file: File,
  token: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(buildUploadUrl("/uploads"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const payload = (await response.json()) as ApiResponse<{
      url?: string;
      imageUrl?: string;
      path?: string;
    }>;

    if (payload.success) {
      const raw =
        payload.data.url ??
        payload.data.imageUrl ??
        payload.data.path ??
        undefined;
      return { success: true, url: raw ? resolveMediaUrl(raw) : undefined };
    }

    const code = payload.error?.code;
    const message = payload.error?.message ?? "";
    const needsFallback =
      code === "FORBIDDEN" ||
      /insufficient permissions/i.test(message) ||
      response.status === 403;

    if (needsFallback) {
      return uploadViaStorefront(file, token);
    }

    return {
      success: false,
      error: message || "อัปโหลดไฟล์ไม่สำเร็จ",
    };
  } catch {
    return uploadViaStorefront(file, token);
  }
}
