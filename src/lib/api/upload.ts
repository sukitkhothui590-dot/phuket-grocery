import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiResponse } from "@/lib/api/client";
import { resolveMediaUrl } from "@/lib/api/media";

function buildUploadUrl(path: string) {
  // POST /backend/uploads/... (Nest controller under global prefix)
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

/**
 * Upload an image to the backend volume.
 *
 * `POST /uploads` is ADMIN-only, so anything a shopper uploads (payment slips,
 * review photos) goes to `POST /uploads/customer`. There is deliberately no
 * storefront-disk fallback: it wrote files the backoffice could never read and
 * lost them on redeploy.
 */
export async function uploadFile(
  file: File,
  token: string,
  options?: { endpoint?: "/uploads" | "/uploads/customer" },
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(buildUploadUrl(options?.endpoint ?? "/uploads"), {
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

    return {
      success: false,
      error: payload.error?.message ?? "อัปโหลดไฟล์ไม่สำเร็จ",
    };
  } catch {
    return { success: false, error: "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }
}

/** Slips and review photos — the customer-accessible endpoint. */
export function uploadCustomerFile(file: File, token: string) {
  return uploadFile(file, token, { endpoint: "/uploads/customer" });
}
