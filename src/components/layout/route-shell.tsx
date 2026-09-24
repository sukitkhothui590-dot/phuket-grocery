"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface RouteShellProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function RouteShell({ header, footer, children }: RouteShellProps) {
  const pathname = usePathname();
  const isStaffRoute = pathname.startsWith("/staff");

  return (
    <div className="flex min-h-screen flex-col">
      {!isStaffRoute && header}
      <main key="route-content" className="flex-1">{children}</main>
      {!isStaffRoute && footer}
    </div>
  );
}
