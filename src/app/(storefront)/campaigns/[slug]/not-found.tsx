import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignNotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Clock3 className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-foreground">
        ไม่พบแคมเปญนี้
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        แคมเปญอาจสิ้นสุดแล้ว ถูกปิดใช้งาน หรือไม่มีอยู่ในระบบ
      </p>
      <Button className="mt-6" nativeButton={false} render={<Link href="/campaigns" />}>
        ดูแคมเปญที่กำลังจัดอยู่
      </Button>
    </main>
  );
}
