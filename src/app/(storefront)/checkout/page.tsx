"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  ChevronDown,
  CreditCard,
  MapPin,
  Plus,
  Search,
  Store,
  Ticket,
  Truck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { syncCartToServer } from "@/lib/api/cart";
import { uploadFile } from "@/lib/api/upload";
import { createAddress } from "@/lib/api/addresses";
import { checkout } from "@/lib/api/orders";
import { getStoreSettings } from "@/lib/api/settings";
import { clearCartEverywhere } from "@/lib/cart-actions";
import {
  COMPANY_INFO,
} from "@/lib/constants";
import { useCouponWalletStore } from "@/stores/coupon-wallet-store";
import type { Address, PaymentMethod, ShippingMethod } from "@/types";

type RegionStep = "province" | "district" | "subdistrict" | "postal";
type AddressLabel = "บ้าน" | "ที่ทำงาน";

function formatAddress(address: Address) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.subDistrict,
    address.district,
    address.province,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function getDeliveryWindow(method: ShippingMethod) {
  return method === "express" ? "วันนี้ - พรุ่งนี้" : "1 - 2 วันทำการ";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, accessToken } = useAuthStore();
  const { items, coupon, discount, getSubtotal } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [transferDate, setTransferDate] = useState("");
  const [transferTime, setTransferTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [bankAccountInfo, setBankAccountInfo] = useState("");
  const [codFee, setCodFee] = useState(20);
  const [shippingCosts, setShippingCosts] = useState({
    standard: 50,
    express: 100,
  });

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [addressLabelMode, setAddressLabelMode] = useState<AddressLabel>("บ้าน");
  const [setAsDefaultAddress, setSetAsDefaultAddress] = useState(false);

  const [geoError, setGeoError] = useState("");
  const [regionLoading, setRegionLoading] = useState(false);
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [regionStep, setRegionStep] = useState<RegionStep>("province");
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [subdistrictOptions, setSubdistrictOptions] = useState<string[]>([]);
  const [postalOptions, setPostalOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    void (async () => {
      const settings = await getStoreSettings();
      setFreeShippingThreshold(settings.freeShippingThreshold);
      setBankAccountInfo(settings.bankAccount);
      setCodFee(settings.codFee);
      setShippingCosts({
        standard: settings.shippingCostStandard,
        express: settings.shippingCostExpress,
      });
    })();
  }, []);

  useEffect(() => {
    if (user?.addresses.length) {
      const defaultAddress =
        user.addresses.find((address) => address.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [user]);

  const fetchRegionOptions = async (
    level: "provinces" | "districts" | "subdistricts" | "postalcodes",
    params?: Record<string, string>
  ) => {
    setRegionLoading(true);
    setGeoError("");

    try {
      const searchParams = new URLSearchParams({ level });
      Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value) {
          searchParams.set(key, value);
        }
      });

      const response = await fetch(`/api/thai-address?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch options: ${response.status}`);
      }

      const payload = (await response.json()) as { items: string[] };
      return payload.items;
    } catch {
      setGeoError("โหลดข้อมูลพื้นที่ไม่สำเร็จ");
      return [];
    } finally {
      setRegionLoading(false);
    }
  };

  useEffect(() => {
    if (!addressDialogOpen || provinceOptions.length > 0) {
      return;
    }

    void (async () => {
      const items = await fetchRegionOptions("provinces");
      setProvinceOptions(items);
    })();
  }, [addressDialogOpen, provinceOptions.length]);

  const subtotal = getSubtotal();
  const shippingCost =
    subtotal >= freeShippingThreshold ? 0 : shippingCosts[shippingMethod];
  const paymentFee = paymentMethod === "cod" ? codFee : 0;
  const total = Math.max(0, subtotal - discount + shippingCost + paymentFee);

  const selectedPaymentLabel =
    paymentMethod === "cod" ? "เก็บเงินปลายทาง" : "โอนผ่านบัญชีธนาคาร";
  const shippingLabel =
    shippingMethod === "express" ? "ค่าจัดส่งด่วน" : "ค่าจัดส่งมาตรฐาน";
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;

  const canSubmit =
    !!selectedAddress &&
    items.length > 0 &&
    (paymentMethod === "cod" ||
      (!!slipPreview && !!transferDate && !!transferTime));

  const groupedItems = useMemo(
    () => [
      {
        storeName: COMPANY_INFO.shortName,
        items,
      },
    ],
    [items]
  );

  const regionSummary = [
    newAddress.province,
    newAddress.district,
    newAddress.subDistrict,
    newAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const handleSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const openRegionPicker = () => {
    if (!newAddress.province) {
      setRegionStep("province");
    } else if (!newAddress.district) {
      setRegionStep("district");
    } else if (!newAddress.subDistrict) {
      setRegionStep("subdistrict");
    } else {
      setRegionStep("postal");
    }

    setRegionPickerOpen(true);
  };

  const handleProvinceSelect = async (province: string) => {
    setNewAddress((current) => ({
      ...current,
      province,
      district: "",
      subDistrict: "",
      postalCode: "",
    }));
    setDistrictOptions([]);
    setSubdistrictOptions([]);
    setPostalOptions([]);
    setRegionStep("district");
    const items = await fetchRegionOptions("districts", { province });
    setDistrictOptions(items);
  };

  const handleDistrictSelect = async (district: string) => {
    setNewAddress((current) => ({
      ...current,
      district,
      subDistrict: "",
      postalCode: "",
    }));
    setSubdistrictOptions([]);
    setPostalOptions([]);
    setRegionStep("subdistrict");
    const items = await fetchRegionOptions("subdistricts", {
      province: newAddress.province || "",
      district,
    });
    setSubdistrictOptions(items);
  };

  const handleSubdistrictSelect = async (subDistrict: string) => {
    setNewAddress((current) => ({
      ...current,
      subDistrict,
      postalCode: "",
    }));
    setPostalOptions([]);
    setRegionStep("postal");
    const items = await fetchRegionOptions("postalcodes", {
      province: newAddress.province || "",
      district: newAddress.district || "",
      subdistrict: subDistrict,
    });
    setPostalOptions(items);
  };

  const handlePostalSelect = (postalCode: string) => {
    setNewAddress((current) => ({
      ...current,
      postalCode,
    }));
    setRegionPickerOpen(false);
  };

  const handleRegionTabClick = async (step: RegionStep) => {
    setRegionStep(step);

    if (step === "district" && newAddress.province && districtOptions.length === 0) {
      const items = await fetchRegionOptions("districts", {
        province: newAddress.province,
      });
      setDistrictOptions(items);
    }

    if (
      step === "subdistrict" &&
      newAddress.province &&
      newAddress.district &&
      subdistrictOptions.length === 0
    ) {
      const items = await fetchRegionOptions("subdistricts", {
        province: newAddress.province,
        district: newAddress.district,
      });
      setSubdistrictOptions(items);
    }

    if (
      step === "postal" &&
      newAddress.province &&
      newAddress.district &&
      newAddress.subDistrict &&
      postalOptions.length === 0
    ) {
      const items = await fetchRegionOptions("postalcodes", {
        province: newAddress.province,
        district: newAddress.district,
        subdistrict: newAddress.subDistrict,
      });
      setPostalOptions(items);
    }
  };

  const handleSaveNewAddress = async () => {
    if (
      !user ||
      !accessToken ||
      !newAddress.fullName ||
      !newAddress.phone ||
      !newAddress.addressLine1 ||
      !newAddress.subDistrict ||
      !newAddress.district ||
      !newAddress.province ||
      !newAddress.postalCode
    ) {
      return;
    }

    const result = await createAddress(accessToken, {
      label: addressLabelMode,
      fullName: newAddress.fullName,
      phone: newAddress.phone,
      addressLine1: newAddress.addressLine1,
      addressLine2: newAddress.addressLine2,
      subDistrict: newAddress.subDistrict,
      district: newAddress.district,
      province: newAddress.province,
      postalCode: newAddress.postalCode,
      isDefault: user.addresses.length === 0 || setAsDefaultAddress,
    });

    if (!result.success || !result.address) {
      alert(result.error ?? "ไม่สามารถเพิ่มที่อยู่ได้");
      return;
    }

    const address = result.address;
    updateUser({
      addresses: [...user.addresses, address],
    });
    setSelectedAddress(address);
    setAddressDialogOpen(false);
    setNewAddress({});
    setRegionPickerOpen(false);
    setRegionStep("province");
    setDistrictOptions([]);
    setSubdistrictOptions([]);
    setPostalOptions([]);
    setAddressLabelMode("บ้าน");
    setSetAsDefaultAddress(false);
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddress || !canSubmit || !accessToken) {
      return;
    }

    setSubmitting(true);

    try {
      let paymentSlipUrl: string | undefined;

      if (paymentMethod === "bank_transfer" && slipFile) {
        const uploadResult = await uploadFile(slipFile, accessToken);
        if (!uploadResult.success || !uploadResult.url) {
          alert(uploadResult.error ?? "อัปโหลดสลิปไม่สำเร็จ");
          return;
        }
        paymentSlipUrl = uploadResult.url;
      }

      await syncCartToServer(
        accessToken,
        items.map((item) => ({
          unitId: item.selectedUnit.id ?? "",
          quantity: item.quantity,
        })),
      );

      const result = await checkout(accessToken, {
        paymentMethod,
        shippingMethod,
        paymentSlipUrl,
        paymentAmount: paymentMethod === "bank_transfer" ? total : undefined,
        transferDate:
          paymentMethod === "bank_transfer" ? transferDate : undefined,
        transferTime:
          paymentMethod === "bank_transfer" ? transferTime : undefined,
        addressId: selectedAddress.id,
        recipientName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine: selectedAddress.addressLine1,
        subDistrict: selectedAddress.subDistrict,
        district: selectedAddress.district,
        province: selectedAddress.province,
        postalCode: selectedAddress.postalCode,
        note,
        couponCode: coupon?.code,
      });

      if (!result.success || !result.order) {
        alert(result.error ?? "ไม่สามารถสร้างคำสั่งซื้อได้");
        return;
      }

      if (user?.id && coupon?.code) {
        useCouponWalletStore.getState().markUsed(user.id, coupon.code);
      }

      await clearCartEverywhere();
      router.push(`/checkout/success/${result.order.id}`);
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        กำลังโหลด...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          ไม่มีสินค้าในคำสั่งซื้อ
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          กรุณาเลือกสินค้าในตะกร้าก่อนทำรายการ
        </p>
        <Button className="mt-6" onClick={() => router.push("/cart")}>
          กลับไปที่ตะกร้า
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] py-8">
      <div className="mx-auto max-w-6xl px-4">
        <section className="overflow-hidden border border-slate-200 bg-white">
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 text-lg font-semibold text-destructive">
              <MapPin className="h-5 w-5" />
              <span>ที่อยู่ในการจัดส่ง</span>
            </div>

            {selectedAddress ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[28px] font-semibold leading-none text-foreground">
                      {selectedAddress.fullName}
                    </p>
                    <span className="inline-flex border border-destructive/35 px-2 py-0.5 text-xs font-medium text-destructive">
                      ค่าเริ่มต้น
                    </span>
                  </div>
                  <p className="text-[22px] font-semibold leading-none text-foreground">
                    {selectedAddress.phone}
                  </p>
                  <p className="text-sm text-slate-500">{selectedAddress.label}</p>
                </div>

                <div className="pt-1">
                  <p className="text-[15px] leading-7 text-slate-700">
                    {formatAddress(selectedAddress)}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  {user.addresses.length > 1 && (
                    <select
                      value={selectedAddress.id}
                      onChange={(event) => {
                        const nextAddress = user.addresses.find(
                          (address) => address.id === event.target.value
                        );
                        if (nextAddress) {
                          setSelectedAddress(nextAddress);
                        }
                      }}
                      className="h-11 min-w-[220px] border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-primary"
                    >
                      {user.addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.label} - {address.fullName}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => setAddressDialogOpen(true)}
                    className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    เพิ่มที่อยู่ใหม่
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
                <p className="text-sm text-slate-600">ยังไม่มีที่อยู่จัดส่ง</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 gap-2"
                  onClick={() => setAddressDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  เพิ่มที่อยู่จัดส่ง
                </Button>
              </div>
            )}
          </div>
        </section>

        <Dialog
          open={addressDialogOpen}
          onOpenChange={(open) => {
            setAddressDialogOpen(open);
            if (!open) {
              setNewAddress({});
              setRegionPickerOpen(false);
              setRegionStep("province");
              setGeoError("");
              setAddressLabelMode("บ้าน");
              setSetAsDefaultAddress(false);
            }
          }}
        >
          <DialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-sm p-0 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:max-w-[620px]">
            <DialogHeader className="border-b border-slate-200 px-6 py-5">
              <DialogTitle className="text-[18px] font-semibold text-foreground">
                ที่อยู่ใหม่
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="ชื่อ-นามสกุล"
                  value={newAddress.fullName || ""}
                  onChange={(event) =>
                    setNewAddress((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="หมายเลขโทรศัพท์"
                  value={newAddress.phone || ""}
                  onChange={(event) =>
                    setNewAddress((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={openRegionPicker}
                    className="flex h-11 w-full items-center justify-between border border-slate-300 bg-white px-3 text-left text-sm text-slate-500"
                  >
                    <span>
                      {regionSummary ||
                        "จังหวัด, เขต/อำเภอ, แขวง/ตำบล, รหัสไปรษณีย์"}
                    </span>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Search className="h-4 w-4" />
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>
                </div>

                {regionPickerOpen && (
                  <div className="sm:col-span-2 overflow-hidden border border-slate-300">
                    <div className="grid grid-cols-4 border-b border-slate-200 bg-white text-center text-sm">
                      {[
                        { key: "province", label: "จังหวัด" },
                        { key: "district", label: "เขต/อำเภอ" },
                        { key: "subdistrict", label: "แขวง/ตำบล" },
                        { key: "postal", label: "รหัสไปรษณีย์" },
                      ].map((tab) => {
                        const disabled =
                          (tab.key === "district" && !newAddress.province) ||
                          (tab.key === "subdistrict" && !newAddress.district) ||
                          (tab.key === "postal" && !newAddress.subDistrict);

                        const active = regionStep === tab.key;

                        return (
                          <button
                            key={tab.key}
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              void handleRegionTabClick(tab.key as RegionStep)
                            }
                            className={`px-3 py-3 font-medium transition-colors ${
                              active
                                ? "border-b-2 border-destructive text-destructive"
                                : "text-foreground"
                            } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="max-h-64 overflow-y-auto bg-white">
                      {regionLoading ? (
                        <div className="px-4 py-4 text-sm text-slate-500">
                          กำลังโหลดข้อมูลพื้นที่...
                        </div>
                      ) : geoError ? (
                        <div className="px-4 py-4 text-sm text-destructive">
                          {geoError}
                        </div>
                      ) : null}

                      {!regionLoading && !geoError && regionStep === "province" &&
                        provinceOptions.map((province) => (
                          <button
                            key={province}
                            type="button"
                            onClick={() => handleProvinceSelect(province)}
                            className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            {province}
                          </button>
                        ))}

                      {!regionLoading && !geoError && regionStep === "district" &&
                        districtOptions.map((district) => (
                          <button
                            key={district}
                            type="button"
                            onClick={() => handleDistrictSelect(district)}
                            className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            {district}
                          </button>
                        ))}

                      {!regionLoading && !geoError && regionStep === "subdistrict" &&
                        subdistrictOptions.map((subDistrict) => (
                          <button
                            key={subDistrict}
                            type="button"
                            onClick={() => handleSubdistrictSelect(subDistrict)}
                            className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            {subDistrict}
                          </button>
                        ))}

                      {!regionLoading && !geoError && regionStep === "postal" &&
                        postalOptions.map((postalCode) => (
                          <button
                            key={postalCode}
                            type="button"
                            onClick={() => handlePostalSelect(postalCode)}
                            className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            {postalCode}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Input
                    placeholder="บ้านเลขที่, ซอย, หมู่, ถนน, แขวง/ตำบล"
                    value={newAddress.addressLine1 || ""}
                    onChange={(event) =>
                      setNewAddress((current) => ({
                        ...current,
                        addressLine1: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <p className="mb-3 text-sm text-foreground">ติดป้ายเป็น:</p>
                  <div className="flex gap-3">
                    {(["บ้าน", "ที่ทำงาน"] as const).map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setAddressLabelMode(label)}
                        className={`h-10 border px-5 text-sm transition-colors ${
                          addressLabelMode === label
                            ? "border-slate-400 bg-white text-foreground"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-3 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={setAsDefaultAddress}
                      onChange={(event) =>
                        setSetAsDefaultAddress(event.target.checked)
                      }
                      className="h-4 w-4 border-slate-300"
                    />
                    เลือกเป็นที่อยู่ตั้งต้น
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <Button
                variant="ghost"
                className="h-11 rounded-sm px-6 text-slate-700"
                onClick={() => setAddressDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                className="h-11 rounded-sm bg-destructive px-8 text-white hover:bg-destructive/90"
                onClick={handleSaveNewAddress}
              >
                ยืนยัน
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <section className="mt-4 border border-slate-200 bg-white">
          <div className="hidden border-b border-slate-100 px-6 py-4 text-sm text-slate-500 lg:grid lg:grid-cols-[minmax(0,1fr)_170px_140px_160px]">
            <div>สินค้าที่สั่งซื้อแล้ว</div>
            <div className="text-center">ราคาต่อหน่วย</div>
            <div className="text-center">จำนวน</div>
            <div className="text-right">รายการย่อย</div>
          </div>

          {groupedItems.map((group, groupIndex) => {
            const groupSubtotal = group.items.reduce(
              (sum, item) => sum + item.selectedUnit.price * item.quantity,
              0
            );

            return (
              <div
                key={`${group.storeName}-${groupIndex}`}
                className={groupIndex > 0 ? "border-t border-slate-200" : ""}
              >
                <div className="flex items-center gap-3 px-6 py-4 text-sm">
                  <Store className="h-4 w-4 text-slate-600" />
                  <span className="font-medium text-foreground">{group.storeName}</span>
                  <span className="text-primary">แชทเลย</span>
                </div>

                {group.items.map((item) => {
                  const itemSubtotal = item.selectedUnit.price * item.quantity;

                  return (
                    <div
                      key={`${item.productId}-${item.selectedUnit.sku}`}
                      className="grid gap-4 border-t border-slate-100 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_170px_140px_160px] lg:items-center"
                    >
                      <div className="flex gap-4">
                        <div className="h-18 w-18 flex-shrink-0 overflow-hidden border border-slate-200 bg-slate-50">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm leading-6 text-foreground">
                            {item.productName}
                          </p>
                          <p className="mt-2 text-sm text-slate-400">
                            ตัวเลือกสินค้า: {item.selectedUnit.labelTh}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm lg:text-center">
                        <p className="text-foreground">
                          ฿{item.selectedUnit.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-sm lg:text-center">{item.quantity}</div>

                      <div className="text-sm font-medium text-foreground lg:text-right">
                        ฿{itemSubtotal.toLocaleString()}
                      </div>
                    </div>
                  );
                })}

                <div className="grid border-t border-dashed border-slate-200 lg:grid-cols-2">
                  <div className="border-b border-dashed border-slate-200 px-6 py-5 lg:border-b-0 lg:border-r">
                    <label className="block text-sm font-medium text-foreground">
                      หมายเหตุ:
                    </label>
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="(ไม่บังคับ) ฝากข้อความถึงผู้ขายหรือบริษัทขนส่ง"
                      className="mt-3 h-12 w-full resize-none border border-slate-300 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-primary"
                    />
                  </div>

                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          ตัวเลือกการจัดส่ง:
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-primary">
                          <Truck className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {getDeliveryWindow(shippingMethod)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          {shippingMethod === "express"
                            ? "Express Delivery - จัดส่งด่วนในวันถัดไป"
                            : "Standard Delivery - ส่งธรรมดาทั่วประเทศ"}
                        </p>
                        {qualifiesForFreeShipping ? (
                          <p className="mt-1 text-xs text-green-600">
                            ส่งฟรี เพราะยอดสั่งซื้อครบ ฿
                            {freeShippingThreshold.toLocaleString()}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">
                            สั่งเพิ่มอีก ฿
                            {amountToFreeShipping.toLocaleString()} จะได้ส่งฟรี
                            (ขั้นต่ำ ฿
                            {freeShippingThreshold.toLocaleString()})
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setShippingMethod((current) =>
                              current === "standard" ? "express" : "standard"
                            )
                          }
                          className="text-sm text-primary transition-colors hover:text-primary/80"
                        >
                          เปลี่ยน
                        </button>
                        <p className="mt-3 text-sm text-foreground">
                          {shippingCost === 0
                            ? "ฟรี"
                            : `฿${shippingCost.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Ticket className="h-4 w-4 text-destructive" />
                      <span>โค้ดส่วนลดร้านค้า</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-destructive">
                        {coupon ? `-${coupon.code}` : "กดใช้โค้ด"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end border-t border-slate-100 px-6 py-6">
                  <p className="text-sm text-slate-500">
                    คำสั่งซื้อทั้งหมด ({group.items.length} ชิ้น):
                    <span className="ml-4 font-semibold text-destructive">
                      ฿{(groupSubtotal + shippingCost + paymentFee).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-4 border border-slate-200 bg-white">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3 text-2xl text-foreground">
              <Ticket className="h-5 w-5 text-destructive" />
              <span className="text-base">โค้ดส่วนลดของร้าน</span>
            </div>
            <span className="text-sm text-primary">
              {coupon ? coupon.code : "กดใช้โค้ด"}
            </span>
          </div>
        </section>

        <section className="mt-4 border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-500" />
              <span className="text-base font-medium text-foreground">
                วิธีการชำระเงิน
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors ${
                  paymentMethod === "cod"
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-slate-300 text-slate-600 hover:border-primary/40"
                }`}
              >
                <Banknote className="h-4 w-4" />
                เก็บเงินปลายทาง
                {codFee > 0 ? ` (+฿${codFee})` : ""}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`inline-flex items-center gap-2 border px-4 py-2 text-sm transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-slate-300 text-slate-600 hover:border-primary/40"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                โอนผ่านบัญชี
              </button>
            </div>
          </div>

          {paymentMethod === "bank_transfer" && (
            <div className="border-b border-slate-100 px-6 py-5">
              {bankAccountInfo && (
                <p className="mb-4 rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  โอนเข้าบัญชี: {bankAccountInfo}
                </p>
              )}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 text-sm text-slate-700">
                  <p className="font-medium text-foreground">อัปโหลดหลักฐานการโอน</p>
                  <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500 hover:border-primary/40 hover:text-primary">
                    <Upload className="h-5 w-5" />
                    <span>คลิกเพื่อเลือกสลิป</span>
                    <input type="file" className="hidden" onChange={handleSlipUpload} />
                  </label>
                  {slipPreview && (
                    <img
                      src={slipPreview}
                      alt="Slip preview"
                      className="h-36 w-auto rounded border border-slate-200 object-cover"
                    />
                  )}
                </div>

                <div className="grid gap-3 self-start sm:grid-cols-2">
                  <Input
                    type="date"
                    value={transferDate}
                    onChange={(event) => setTransferDate(event.target.value)}
                  />
                  <Input
                    type="time"
                    value={transferTime}
                    onChange={(event) => setTransferTime(event.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-6">
            <div className="ml-auto max-w-md space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ราคาสินค้า</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{shippingLabel}</span>
                <span>
                  {shippingCost === 0
                    ? "ฟรี"
                    : `฿${shippingCost.toLocaleString()}`}
                </span>
              </div>
              {qualifiesForFreeShipping ? (
                <p className="-mt-2 text-right text-xs text-green-600">
                  ส่งฟรีเมื่อยอดครบ ฿{freeShippingThreshold.toLocaleString()}
                </p>
              ) : (
                <p className="-mt-2 text-right text-xs text-slate-500">
                  สั่งครบ ฿{freeShippingThreshold.toLocaleString()} ส่งฟรี
                  (อีก ฿{amountToFreeShipping.toLocaleString()})
                </p>
              )}
              {paymentFee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">ค่าธรรมเนียม COD</span>
                  <span>฿{paymentFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">ส่วนลดคูปอง</span>
                <span className="text-destructive">
                  -฿{discount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-base text-slate-700">ยอดชำระเงินทั้งหมด</span>
                <span className="text-2xl font-semibold text-destructive">
                  ฿{total.toLocaleString()}
                </span>
              </div>
              <p className="text-right text-[11px] text-slate-400">
                <a href="/fees" className="hover:text-primary hover:underline">
                  ดูค่าใช้จ่ายทั้งหมดในระบบ
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-3xl text-xs leading-6 text-slate-500">
              โดยการคลิก "สั่งสินค้า" ฉันได้อ่านและยอมรับเงื่อนไขการให้บริการ
              และนโยบายการจัดส่งของ {COMPANY_INFO.shortName}
            </p>
            <div className="text-right">
              <p className="mb-2 text-sm text-slate-500">{selectedPaymentLabel}</p>
              <Button
                onClick={handleSubmitOrder}
                disabled={!canSubmit || submitting}
                className="h-12 min-w-[210px] rounded-sm bg-destructive text-base font-semibold text-white hover:bg-destructive/90"
              >
                {submitting ? "กำลังดำเนินการ..." : "สั่งสินค้า"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
