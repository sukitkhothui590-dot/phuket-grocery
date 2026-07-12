"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  FileText,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDeliveryTracker } from "@/components/order/order-delivery-tracker";
import { useAuthStore } from "@/stores/auth-store";
import { cancelOrder, getOrderById, uploadOrderSlip } from "@/lib/api/orders";
import { uploadFile } from "@/lib/api/upload";
import { getStoreSettings } from "@/lib/api/settings";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { ORDER_STATUS_CONFIG, ORDER_STATUS_FLOW } from "@/lib/order-status";
import type { Order } from "@/types";
import { Input } from "@/components/ui/input";

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAddress(order: Order) {
  return [
    order.shippingAddress.addressLine1,
    order.shippingAddress.addressLine2,
    order.shippingAddress.subDistrict,
    order.shippingAddress.district,
    order.shippingAddress.province,
    order.shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [bankAccountInfo, setBankAccountInfo] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    void (async () => {
      const settings = await getStoreSettings();
      setBankAccountInfo(settings.bankAccount);
    })();
  }, []);

  useEffect(() => {
    async function load() {
      const fetchedOrder = await getOrderById(id, accessToken);
      setOrder(fetchedOrder);
      setLoading(false);
    }

    if (id && accessToken) {
      void load();
    }
  }, [id, accessToken]);

  const canCancel =
    order?.status === "pending_payment" || order?.status === "pending_verify";

  const canUploadSlip =
    order?.paymentMethod === "bank_transfer" &&
    (order.status === "pending_payment" || order.status === "pending_verify") &&
    !order.slipImage;

  const handleCancelOrder = async () => {
    if (!order || !accessToken || !canCancel) return;

    const confirmed = window.confirm("ต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?");
    if (!confirmed) return;

    setCancelling(true);
    const result = await cancelOrder(accessToken, order.id);
    setCancelling(false);

    if (result.success && result.order) {
      setOrder(result.order);
      return;
    }

    alert(result.error ?? "ไม่สามารถยกเลิกคำสั่งซื้อได้");
  };

  const handleSlipUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !order || !accessToken || !canUploadSlip) return;

    if (!transferDate || !transferTime) {
      alert("กรุณาระบุวันที่และเวลาโอนก่อนอัปโหลดสลิป");
      event.target.value = "";
      return;
    }

    setUploadingSlip(true);

    const uploadResult = await uploadFile(file, accessToken);
    if (!uploadResult.success || !uploadResult.url) {
      setUploadingSlip(false);
      alert(uploadResult.error ?? "อัปโหลดสลิปไม่สำเร็จ");
      return;
    }

    const result = await uploadOrderSlip(accessToken, order.id, {
      paymentSlipUrl: uploadResult.url,
      paymentAmount: order.total,
      transferDate,
      transferTime,
    });

    setUploadingSlip(false);
    event.target.value = "";

    if (result.success && result.order) {
      setOrder(result.order);
      return;
    }

    alert(result.error ?? "ไม่สามารถบันทึกสลิปได้");
  };

  const currentStatusIndex = useMemo(() => {
    if (!order) {
      return -1;
    }

    return ORDER_STATUS_FLOW.indexOf(order.status);
  }, [order]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลดรายละเอียดคำสั่งซื้อ...
      </div>
    );
  }

  if (!order) {
    return (
      <main className="bg-slate-50 py-10">
        <section className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border bg-white px-6 py-14 text-center shadow-sm">
            <Package className="mx-auto h-14 w-14 text-slate-300" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              ไม่พบคำสั่งซื้อ
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              คำสั่งซื้อนี้อาจถูกลบไปแล้ว หรือยังไม่มีข้อมูลในระบบ
            </p>
            <Link href="/account/orders">
              <Button className="mt-5 rounded-full px-5">กลับไปหน้าคำสั่งซื้อ</Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const status = ORDER_STATUS_CONFIG[order.status];
  const isCancelled = order.status === "cancelled";
  const showDeliveryTracker =
    order.status === "preparing" || order.status === "shipped";

  return (
    <main className="bg-slate-50 py-8">
      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-5">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าคำสั่งซื้อ
          </Link>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Order Detail</p>
                <h1 className="mt-1 text-2xl font-semibold text-foreground">
                  คำสั่งซื้อ {order.orderNumber}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  สร้างคำสั่งซื้อเมื่อ {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${status.colorClass}`}
                >
                  {status.label}
                </span>
                <Link href={`/account/orders/${order.id}/receipt`}>
                  <Button variant="outline" className="gap-2 rounded-full">
                    <FileText className="h-4 w-4" />
                    ใบเสร็จรับเงิน
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {!isCancelled && (
            <div className="border-b px-6 py-6">
              <div className="grid gap-5 md:grid-cols-5">
                {ORDER_STATUS_FLOW.map((step, index) => {
                  const stepConfig = ORDER_STATUS_CONFIG[step];
                  const isPassed = currentStatusIndex > index;
                  const isCurrent = currentStatusIndex === index;

                  return (
                    <div key={step} className="flex items-start gap-3 md:block">
                      <div className="flex items-center md:justify-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                            isPassed || isCurrent
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isPassed ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                      </div>
                      <div className="md:mt-3 md:text-center">
                        <p
                          className={`text-sm font-medium ${
                            isPassed || isCurrent
                              ? "text-foreground"
                              : "text-slate-400"
                          }`}
                        >
                          {stepConfig.shortLabel}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {stepConfig.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showDeliveryTracker && (
            <div className="border-b px-6 py-6">
              <OrderDeliveryTracker order={order} />
            </div>
          )}

          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    รายการสินค้า
                  </h2>
                </div>
                <div className="divide-y">
                  {order.items.map((item, index) => (
                    <div
                      key={
                        item.id ??
                        `${item.productId}-${item.selectedUnit.id}-${index}`
                      }
                      className="flex gap-4 px-5 py-4"
                    >
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-slate-50">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-foreground">
                          {item.productName}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          {item.selectedUnit.labelTh}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          จำนวน {item.quantity} ชิ้น
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-400">รวม</p>
                        <p className="mt-1 font-semibold text-foreground">
                          ฿{item.subtotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border bg-white">
                  <div className="border-b px-5 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <MapPin className="h-5 w-5 text-primary" />
                      ที่อยู่จัดส่ง
                    </h2>
                  </div>
                  <div className="px-5 py-4 text-sm leading-7 text-slate-600">
                    <p className="font-semibold text-foreground">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.phone}</p>
                    <p className="mt-2">{formatAddress(order)}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      ป้ายที่อยู่: {order.shippingAddress.label}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white">
                  <div className="border-b px-5 py-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <CreditCard className="h-5 w-5 text-primary" />
                      การชำระเงินและจัดส่ง
                    </h2>
                  </div>
                  <div className="space-y-3 px-5 py-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">วิธีชำระเงิน</span>
                      <span className="font-medium text-foreground">
                        {order.paymentMethod === "cod"
                          ? "เก็บเงินปลายทาง"
                          : "โอนผ่านบัญชี"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">วิธีจัดส่ง</span>
                      <span className="font-medium text-foreground">
                        {order.shippingMethod === "express"
                          ? "จัดส่งด่วน"
                          : "จัดส่งมาตรฐาน"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">อัปเดตล่าสุด</span>
                      <span className="font-medium text-foreground">
                        {formatDateTime(order.updatedAt)}
                      </span>
                    </div>
                    {order.slipImage && (
                      <div className="border-t pt-3">
                        <p className="mb-2 text-slate-500">สลิปการโอน</p>
                        <a
                          href={order.slipImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg border"
                        >
                          <img
                            src={order.slipImage}
                            alt="สลิปการโอน"
                            className="h-40 w-full object-cover"
                          />
                        </a>
                        {order.slipUploadedAt && (
                          <p className="mt-2 text-xs text-slate-400">
                            อัปโหลดเมื่อ {formatDateTime(order.slipUploadedAt)}
                          </p>
                        )}
                      </div>
                    )}
                    {canUploadSlip && (
                      <div className="space-y-3 border-t pt-3">
                        {bankAccountInfo && (
                          <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            โอนเข้าบัญชี: {bankAccountInfo}
                          </p>
                        )}
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Input
                            type="date"
                            value={transferDate}
                            onChange={(event) =>
                              setTransferDate(event.target.value)
                            }
                          />
                          <Input
                            type="time"
                            value={transferTime}
                            onChange={(event) =>
                              setTransferTime(event.target.value)
                            }
                          />
                        </div>
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-slate-600 hover:border-primary hover:text-primary">
                          <Upload className="h-4 w-4" />
                          {uploadingSlip ? "กำลังอัปโหลด..." : "อัปโหลดสลิปการโอน"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingSlip}
                            onChange={handleSlipUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Package className="h-5 w-5 text-primary" />
                    สรุปยอด
                  </h2>
                </div>
                <div className="space-y-3 px-5 py-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ยอดสินค้า</span>
                    <span>฿{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ค่าส่ง</span>
                    <span>
                      {order.shippingCost === 0
                        ? "ฟรี"
                        : `฿${order.shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                  {order.shippingCost === 0 && (
                    <p className="-mt-1 text-right text-xs text-green-600">
                      ส่งฟรีเมื่อยอดครบ ฿
                      {FREE_SHIPPING_THRESHOLD.toLocaleString()}
                    </p>
                  )}
                  {(order.paymentFee ?? 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">ค่าธรรมเนียม COD</span>
                      <span>฿{(order.paymentFee ?? 0).toLocaleString()}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>
                        ส่วนลด {order.couponCode ? `(${order.couponCode})` : ""}
                      </span>
                      <span>-฿{order.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-foreground">
                        ยอดชำระทั้งหมด
                      </span>
                      <span className="text-xl font-semibold text-destructive">
                        ฿{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Truck className="h-5 w-5 text-primary" />
                    สถานะปัจจุบัน
                  </h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    {status.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {status.description}
                  </p>
                  {canCancel && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                    >
                      {cancelling ? "กำลังยกเลิก..." : "ยกเลิกคำสั่งซื้อ"}
                    </Button>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
