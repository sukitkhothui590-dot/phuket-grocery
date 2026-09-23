import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiResponse } from "@/lib/api/client";
import { resolveMediaUrl } from "@/lib/api/media";
import { getAccessToken, refreshAccessToken } from "@/lib/api/token";

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
 * Optimizes an image for upload in browser environments:
 * - Resizes large photos (e.g. 10MB phone camera shots) to max 1600px width/height.
 * - Compresses to JPEG 85% (~200KB - 400KB), avoiding the 5MB/15MB server limit.
 * - Automatically converts iPhone HEIC (which iOS Safari decodes onto Canvas) to standard JPEG.
 */
async function optimizeImageForUpload(file: File): Promise<File> {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return file;
  }
  // GIFs and SVGs should not be flattened to JPEG
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  try {
    return await new Promise<File>((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1600;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            const converted = new File([blob], `${nameWithoutExt}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(converted);
          },
          "image/jpeg",
          0.85,
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  } catch {
    return file;
  }
}

/**
 * Upload an image to the backend volume.
 *
 * `POST /uploads` is ADMIN-only, so anything a shopper uploads (payment slips,
 * review photos) goes to `POST /uploads/customer`.
 * Includes automatic image compression and automatic token refresh on 401.
 */
export async function uploadFile(
  file: File,
  token?: string | null,
  options?: { endpoint?: "/uploads" | "/uploads/customer" },
): Promise<{ success: boolean; url?: string; error?: string }> {
  let activeToken = token || getAccessToken() || "";
  const uploadUrl = buildUploadUrl(options?.endpoint ?? "/uploads");

  try {
    const fileToUpload = await optimizeImageForUpload(file);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    let response = await fetch(uploadUrl, {
      method: "POST",
      headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        activeToken = refreshed;
        const retryFormData = new FormData();
        retryFormData.append("file", fileToUpload);
        response = await fetch(uploadUrl, {
          method: "POST",
          headers: { Authorization: `Bearer ${activeToken}` },
          body: retryFormData,
        });
      }
    }

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

    let errorMsg = payload.error?.message ?? "อัปโหลดไฟล์ไม่สำเร็จ";
    if (errorMsg.includes("file size") || response.status === 413) {
      errorMsg = "ขนาดไฟล์ใหญ่เกินไป กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 15MB";
    } else if (errorMsg.includes("Unsupported file type")) {
      errorMsg = "รูปแบบไฟล์ไม่ถูกต้อง กรุณาอัปโหลดรูปภาพ JPG, PNG หรือ WEBP";
    }

    return {
      success: false,
      error: errorMsg,
    };
  } catch {
    return { success: false, error: "อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" };
  }
}

/** Slips and review photos — the customer-accessible endpoint. */
export function uploadCustomerFile(file: File, token?: string | null) {
  return uploadFile(file, token, { endpoint: "/uploads/customer" });
}
