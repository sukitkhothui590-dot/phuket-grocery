import { Suspense } from "react";
import CouponsPageClient from "./coupons-client";

export default function CouponsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
          กำลังโหลดคูปอง...
        </div>
      }
    >
      <CouponsPageClient />
    </Suspense>
  );
}
