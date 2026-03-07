"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { getOrders } from "@/lib/api/orders";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import { Eye, Package } from "lucide-react";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  ...Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => ({
    value,
    label,
  })),
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function load() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Package className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">คำสั่งซื้อของฉัน</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Button
            key={s.value}
            variant={filter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center">
          <Package className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">ไม่พบคำสั่งซื้อ</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>เลขคำสั่งซื้อ</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">ยอดรวม</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      ORDER_STATUS_MAP[order.status]?.color
                    )}
                  >
                    {ORDER_STATUS_MAP[order.status]?.label}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  ฿{order.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
