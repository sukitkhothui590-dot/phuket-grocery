import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">
        ไม่พบหน้าที่คุณค้นหา
      </h1>
      <p className="mt-2 text-gray-500">
        ขออภัย หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-white transition hover:bg-primary"
      >
        กลับหน้าแรก
      </Link>
    </div>
  );
}
