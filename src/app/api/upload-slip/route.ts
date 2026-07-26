import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 8 * 1024 * 1024;

function extensionFor(type: string, fallbackName: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  const fromName = fallbackName.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  return "jpg";
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "กรุณาเข้าสู่ระบบก่อนอัปโหลดสลิป" },
      },
      { status: 401 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "ไม่พบไฟล์สลิป" },
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type) && !file.name.match(/\.(jpe?g|png|webp|gif)$/i)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "รองรับเฉพาะไฟล์รูปภาพ JPG PNG WEBP",
          },
        },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "ขนาดไฟล์ต้องไม่เกิน 8MB" },
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = extensionFor(file.type, file.name);
    const filename = `slip-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
    const dir = path.join(process.cwd(), "public", "slips");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin;

    const url = `${origin.replace(/\/$/, "")}/slips/${filename}`;

    return NextResponse.json({
      success: true,
      data: { url, path: `/slips/${filename}` },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UPLOAD_FAILED", message: "อัปโหลดสลิปไม่สำเร็จ" },
      },
      { status: 500 },
    );
  }
}
