"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BANK_ACCOUNTS,
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/constants";
import type { Address, PaymentMethod, ShippingMethod } from "@/types";
import {
  ShoppingBag,
  MapPin,
  Truck,
  CreditCard,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "ตะกร้าสินค้า", icon: ShoppingBag },
  { id: 2, label: "ที่อยู่จัดส่ง", icon: MapPin },
  { id: 3, label: "วิธีจัดส่ง", icon: Truck },
  { id: 4, label: "ชำระเงิน", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, coupon, discount, getSubtotal, clearCart } = useCartStore();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("bank_transfer");
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user?.addresses.length) {
      const defaultAddr =
        user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [user]);

  if (!user || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <ShoppingBag className="mx-auto size-16 text-muted-foreground/30" />
        <h1 className="mt-4 text-xl font-medium">ตะกร้าสินค้าว่างเปล่า</h1>
        <p className="mt-2 text-muted-foreground">
          กรุณาเลือกสินค้าก่อนทำการสั่งซื้อ
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          กลับไปเลือกสินค้า
        </Button>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST[shippingMethod];
  const total = subtotal - discount + shippingCost;

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const orderId = `ord-${Date.now()}`;
    const orderNumber = `PG-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`;

    const order = {
      id: orderId,
      orderNumber,
      items: items.map((item) => ({
        ...item,
        subtotal: item.selectedUnit.price * item.quantity,
      })),
      status:
        paymentMethod === "bank_transfer" && slipPreview
          ? "pending_verify"
          : "pending_payment",
      paymentMethod,
      shippingMethod,
      shippingAddress: selectedAddress,
      couponCode: coupon?.code,
      discount,
      shippingCost,
      subtotal,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(`order-${orderId}`, JSON.stringify(order));
    } catch {
      /* sessionStorage unavailable */
    }

    clearCart();
    router.push(`/checkout/success/${orderId}`);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return items.length > 0;
      case 2:
        return !!selectedAddress;
      case 3:
        return !!shippingMethod;
      case 4:
        if (paymentMethod === "bank_transfer") {
          return !!slipPreview && !!transferDate && !!transferTime;
        }
        return true;
      default:
        return false;
    }
  };

  const handleSaveNewAddress = () => {
    if (
      newAddress.addressLine1 &&
      newAddress.fullName &&
      newAddress.phone &&
      newAddress.district &&
      newAddress.subDistrict &&
      newAddress.province &&
      newAddress.postalCode
    ) {
      const addr: Address = {
        id: `addr-new-${Date.now()}`,
        label: newAddress.label || "ที่อยู่ใหม่",
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        district: newAddress.district,
        subDistrict: newAddress.subDistrict,
        province: newAddress.province,
        postalCode: newAddress.postalCode,
        isDefault: false,
      };
      setSelectedAddress(addr);
      setShowNewAddress(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">สั่งซื้อสินค้า</h1>

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                step === s.id
                  ? "bg-primary text-white"
                  : step > s.id
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.id ? (
                <Check className="size-3.5" />
              ) : (
                <s.icon className="size-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Step 1: Review cart */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  ตรวจสอบสินค้า ({items.length} รายการ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedUnit.sku}`}
                      className="flex gap-4"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedUnit.labelTh} &times; {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium">
                        ฿
                        {(
                          item.selectedUnit.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>ที่อยู่จัดส่ง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowNewAddress(false);
                      }}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedAddress?.id === addr.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{addr.label}</span>
                            {addr.isDefault && (
                              <Badge variant="secondary">ค่าเริ่มต้น</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm">
                            {addr.fullName} | {addr.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`},{" "}
                            {addr.subDistrict}, {addr.district},{" "}
                            {addr.province} {addr.postalCode}
                          </p>
                        </div>
                        {selectedAddress?.id === addr.id && (
                          <Check className="size-5 shrink-0 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}

                  {!showNewAddress ? (
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 p-4 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      <Plus className="size-4" />
                      เพิ่มที่อยู่ใหม่
                    </button>
                  ) : (
                    <div className="space-y-3 rounded-lg border p-4">
                      <h4 className="font-medium">ที่อยู่ใหม่</h4>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label>ชื่อที่อยู่</Label>
                          <Input
                            placeholder="เช่น บ้าน, ร้านค้า"
                            value={newAddress.label || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                label: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>ชื่อผู้รับ</Label>
                          <Input
                            placeholder="ชื่อ-นามสกุล"
                            value={newAddress.fullName || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                fullName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>เบอร์โทรผู้รับ</Label>
                        <Input
                          placeholder="0xx-xxx-xxxx"
                          value={newAddress.phone || ""}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>ที่อยู่</Label>
                        <Input
                          placeholder="บ้านเลขที่ ถนน ซอย"
                          value={newAddress.addressLine1 || ""}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine1: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>ที่อยู่เพิ่มเติม (ถ้ามี)</Label>
                        <Input
                          placeholder="อาคาร ชั้น ห้อง"
                          value={newAddress.addressLine2 || ""}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine2: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label>ตำบล/แขวง</Label>
                          <Input
                            value={newAddress.subDistrict || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                subDistrict: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>อำเภอ/เขต</Label>
                          <Input
                            value={newAddress.district || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                district: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label>จังหวัด</Label>
                          <Input
                            value={newAddress.province || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                province: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>รหัสไปรษณีย์</Label>
                          <Input
                            value={newAddress.postalCode || ""}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                postalCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveNewAddress}>
                          ใช้ที่อยู่นี้
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowNewAddress(false)}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Shipping method */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>วิธีจัดส่ง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(["standard", "express"] as ShippingMethod[]).map(
                    (method) => {
                      const cost = SHIPPING_COST[method];
                      const isFree =
                        subtotal >= FREE_SHIPPING_THRESHOLD &&
                        method === "standard";
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setShippingMethod(method)}
                          className={`w-full rounded-lg border p-4 text-left transition-colors ${
                            shippingMethod === method
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {method === "standard"
                                  ? "จัดส่งปกติ"
                                  : "จัดส่งด่วน"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {method === "standard"
                                  ? "จัดส่งภายใน 2-3 วันทำการ"
                                  : "จัดส่งภายใน 1 วันทำการ"}
                              </p>
                            </div>
                            <div className="text-right">
                              {isFree ? (
                                <div>
                                  <span className="font-medium text-green-600">
                                    ฟรี
                                  </span>
                                  <p className="text-xs text-muted-foreground line-through">
                                    ฿{cost}
                                  </p>
                                </div>
                              ) : (
                                <span className="font-medium">฿{cost}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                  {subtotal >= FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-green-600">
                      ยอดสั่งซื้อ ฿{subtotal.toLocaleString()}{" "}
                      ได้ฟรีค่าจัดส่งแบบปกติ (ครบ ฿
                      {FREE_SHIPPING_THRESHOLD.toLocaleString()})
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>วิธีชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {(["bank_transfer", "cod"] as PaymentMethod[]).map(
                      (method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`w-full rounded-lg border p-4 text-left transition-colors ${
                            paymentMethod === method
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <p className="font-medium">
                            {method === "bank_transfer"
                              ? "โอนเงินผ่านธนาคาร"
                              : "เก็บเงินปลายทาง (COD)"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {method === "bank_transfer"
                              ? "โอนเงินแล้วแนบสลิป"
                              : "ชำระเงินเมื่อได้รับสินค้า"}
                          </p>
                        </button>
                      )
                    )}
                  </div>

                  {paymentMethod === "bank_transfer" && (
                    <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                      <h4 className="font-medium">ข้อมูลบัญชีธนาคาร</h4>
                      <div className="space-y-2">
                        {BANK_ACCOUNTS.map((bank, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-background p-3 ring-1 ring-foreground/10"
                          >
                            <p className="font-medium text-primary">
                              {bank.bankName}
                            </p>
                            <p className="text-sm">
                              ชื่อบัญชี: {bank.accountName}
                            </p>
                            <p className="text-sm">
                              เลขบัญชี: {bank.accountNumber}
                            </p>
                            {bank.branch && (
                              <p className="text-sm text-muted-foreground">
                                สาขา: {bank.branch}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">แนบสลิปการโอน</h4>
                        <div className="space-y-1">
                          <Label>สลิปการโอน</Label>
                          <div className="flex items-center gap-3">
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2 text-sm transition-colors hover:border-primary/30 hover:text-primary">
                              <Upload className="size-4" />
                              เลือกไฟล์
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSlipUpload}
                              />
                            </label>
                            {slipPreview && (
                              <span className="text-xs text-green-600">
                                อัปโหลดแล้ว
                              </span>
                            )}
                          </div>
                          {slipPreview && (
                            <div className="relative mt-2 w-48 overflow-hidden rounded-lg border">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={slipPreview}
                                alt="สลิปการโอน"
                                className="w-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>วันที่โอน</Label>
                            <Input
                              type="date"
                              value={transferDate}
                              onChange={(e) => setTransferDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>เวลาที่โอน</Label>
                            <Input
                              type="time"
                              value={transferTime}
                              onChange={(e) => setTransferTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                      กรุณาเตรียมเงินสด ฿{total.toLocaleString()}{" "}
                      สำหรับชำระเมื่อได้รับสินค้า
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="size-4" />
              ย้อนกลับ
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canProceed()}
              >
                ถัดไป
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitOrder}
                disabled={!canProceed() || submitting}
              >
                {submitting ? "กำลังสั่งซื้อ..." : "ยืนยันคำสั่งซื้อ"}
              </Button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedUnit.sku}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="line-clamp-1 flex-1">
                        {item.productName} &times;{item.quantity}
                      </span>
                      <span className="ml-2 shrink-0">
                        ฿
                        {(
                          item.selectedUnit.price * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ยอดสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>ส่วนลด {coupon?.code && `(${coupon.code})`}</span>
                      <span>-฿{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ค่าจัดส่ง</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">ฟรี</span>
                      ) : (
                        `฿${shippingCost}`
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-bold">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-primary">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
