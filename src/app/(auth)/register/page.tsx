"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerApi } from "@/lib/api/auth";
import { initializeUserSession } from "@/lib/session-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThaiRegionPicker } from "@/components/address/thai-region-picker";
import { AddressMapPicker } from "@/components/checkout/address-map-picker";
import { SITE_NAME } from "@/lib/constants";
import { UserPlus } from "lucide-react";

type AddressLabel = "บ้าน" | "ที่ทำงาน";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
    address: z.object({
      label: z.string().min(1, "กรุณาเลือกป้ายที่อยู่"),
      fullName: z.string().min(1, "กรุณากรอกชื่อผู้รับ"),
      phone: z.string().min(9, "กรุณากรอกเบอร์โทรผู้รับ"),
      addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
      addressLine2: z.string().optional(),
      district: z.string().min(1, "กรุณาเลือกอำเภอ/เขต"),
      subDistrict: z.string().min(1, "กรุณาเลือกตำบล/แขวง"),
      province: z.string().min(1, "กรุณาเลือกจังหวัด"),
      postalCode: z.string().min(5, "กรุณาเลือกรหัสไปรษณีย์"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [regionError, setRegionError] = useState("");
  const [addressLabelMode, setAddressLabelMode] =
    useState<AddressLabel>("บ้าน");
  const [selectedMapPoint, setSelectedMapPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapSelectionLabel, setMapSelectionLabel] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      address: {
        label: "บ้าน",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
      },
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const phone = watch("phone");
  const addressFullName = watch("address.fullName");
  const addressPhone = watch("address.phone");
  const addressLine1 = watch("address.addressLine1");
  const province = watch("address.province");
  const district = watch("address.district");
  const subDistrict = watch("address.subDistrict");
  const postalCode = watch("address.postalCode");

  const regionSummary = [province, district, subDistrict, postalCode]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    if (fullName && !addressFullName) {
      setValue("address.fullName", fullName);
    }
  }, [firstName, lastName, addressFullName, setValue]);

  useEffect(() => {
    if (phone && !addressPhone) {
      setValue("address.phone", phone);
    }
  }, [phone, addressPhone, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    if (
      !data.address.province ||
      !data.address.district ||
      !data.address.subDistrict ||
      !data.address.postalCode
    ) {
      setRegionError("กรุณาเลือกจังหวัด อำเภอ ตำบล และรหัสไปรษณีย์");
      return;
    }

    setLoading(true);
    setError("");
    setRegionError("");

    try {
      const result = await registerApi({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        address: {
          ...data.address,
          label: addressLabelMode,
        },
      });

      if (
        result.success &&
        result.user &&
        result.accessToken &&
        result.refreshToken
      ) {
        await initializeUserSession(result.user, {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
        router.push("/");
      } else {
        setError(result.error || "สมัครสมาชิกไม่สำเร็จ");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">{SITE_NAME}</CardTitle>
        <CardDescription>สร้างบัญชีเพื่อเริ่มช้อปปิ้ง</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              ข้อมูลส่วนตัว
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input
                  id="firstName"
                  placeholder="ชื่อ"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input
                  id="lastName"
                  placeholder="นามสกุล"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  placeholder="0xx-xxx-xxxx"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="รหัสผ่านอีกครั้ง"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Address section — same layout as checkout "ที่อยู่ใหม่" */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              ที่อยู่จัดส่ง
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Input
                  placeholder="ชื่อ-นามสกุล"
                  {...register("address.fullName")}
                />
                {errors.address?.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.address.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Input
                  placeholder="หมายเลขโทรศัพท์"
                  {...register("address.phone")}
                />
                {errors.address?.phone && (
                  <p className="text-xs text-red-500">
                    {errors.address.phone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <ThaiRegionPicker
                  variant="checkout"
                  value={{
                    province: province || "",
                    district: district || "",
                    subDistrict: subDistrict || "",
                    postalCode: postalCode || "",
                  }}
                  onChange={(next) => {
                    setRegionError("");
                    setValue("address.province", next.province, {
                      shouldValidate: true,
                    });
                    setValue("address.district", next.district, {
                      shouldValidate: true,
                    });
                    setValue("address.subDistrict", next.subDistrict, {
                      shouldValidate: true,
                    });
                    setValue("address.postalCode", next.postalCode, {
                      shouldValidate: true,
                    });
                  }}
                  error={
                    regionError ||
                    errors.address?.province?.message ||
                    errors.address?.district?.message ||
                    errors.address?.subDistrict?.message ||
                    errors.address?.postalCode?.message
                  }
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Input
                  placeholder="บ้านเลขที่, ซอย, หมู่, ถนน, แขวง/ตำบล"
                  {...register("address.addressLine1")}
                />
                {errors.address?.addressLine1 && (
                  <p className="text-xs text-red-500">
                    {errors.address.addressLine1.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <AddressMapPicker
                  value={selectedMapPoint}
                  selectedLabel={mapSelectionLabel}
                  onChange={(selection) => {
                    const nextProvince = selection.province || "";
                    const nextDistrict = selection.district || "";
                    const nextSubDistrict = selection.subDistrict || "";
                    const nextPostalCode = selection.postalCode || "";

                    setSelectedMapPoint({
                      lat: selection.lat,
                      lng: selection.lon,
                    });
                    setMapSelectionLabel(
                      selection.displayName ||
                        selection.addressLine1 ||
                        regionSummary,
                    );

                    if (nextProvince) {
                      setValue("address.province", nextProvince, {
                        shouldValidate: true,
                      });
                    }
                    if (nextDistrict) {
                      setValue("address.district", nextDistrict, {
                        shouldValidate: true,
                      });
                    }
                    if (nextSubDistrict) {
                      setValue("address.subDistrict", nextSubDistrict, {
                        shouldValidate: true,
                      });
                    }
                    if (nextPostalCode) {
                      setValue("address.postalCode", nextPostalCode, {
                        shouldValidate: true,
                      });
                    }
                    if (!addressLine1 && selection.addressLine1) {
                      setValue("address.addressLine1", selection.addressLine1, {
                        shouldValidate: true,
                      });
                    }
                    if (selection.displayName) {
                      setValue("address.addressLine2", selection.displayName);
                    }
                    setRegionError("");
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <p className="mb-3 text-sm text-foreground">ติดป้ายเป็น:</p>
                <div className="flex gap-3">
                  {(["บ้าน", "ที่ทำงาน"] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setAddressLabelMode(label);
                        setValue("address.label", label, {
                          shouldValidate: true,
                        });
                      }}
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
                {errors.address?.label && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.address.label.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <UserPlus className="size-4" />
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-primary hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
