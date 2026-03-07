"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as registerApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
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
import { SITE_NAME } from "@/lib/constants";
import { UserPlus } from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "กรุณากรอกชื่อ"),
    lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
    email: z.string().email("อีเมลไม่ถูกต้อง"),
    phone: z.string().min(9, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
    password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
    address: z.object({
      label: z.string().min(1, "กรุณาตั้งชื่อที่อยู่ เช่น บ้าน, ร้านค้า"),
      fullName: z.string().min(1, "กรุณากรอกชื่อผู้รับ"),
      phone: z.string().min(9, "กรุณากรอกเบอร์โทรผู้รับ"),
      addressLine1: z.string().min(1, "กรุณากรอกที่อยู่"),
      addressLine2: z.string().optional(),
      district: z.string().min(1, "กรุณากรอกอำเภอ/เขต"),
      subDistrict: z.string().min(1, "กรุณากรอกตำบล/แขวง"),
      province: z.string().min(1, "กรุณากรอกจังหวัด"),
      postalCode: z.string().min(5, "รหัสไปรษณีย์ไม่ถูกต้อง"),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      address: { province: "ภูเก็ต" },
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");
    try {
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        address: data.address,
      };
      const result = await registerApi(registerData);
      if (result.success && result.user) {
        setUser(result.user);
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
            <h3 className="text-sm font-medium text-foreground">
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
                  placeholder="อย่างน้อย 6 ตัวอักษร"
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

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              ที่อยู่จัดส่ง
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="addr-label">ชื่อที่อยู่</Label>
                <Input
                  id="addr-label"
                  placeholder="เช่น บ้าน, ร้านค้า"
                  {...register("address.label")}
                />
                {errors.address?.label && (
                  <p className="text-xs text-red-500">
                    {errors.address.label.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-fullName">ชื่อผู้รับ</Label>
                <Input
                  id="addr-fullName"
                  placeholder="ชื่อ-นามสกุล ผู้รับ"
                  {...register("address.fullName")}
                />
                {errors.address?.fullName && (
                  <p className="text-xs text-red-500">
                    {errors.address.fullName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-phone">เบอร์โทรผู้รับ</Label>
              <Input
                id="addr-phone"
                placeholder="0xx-xxx-xxxx"
                {...register("address.phone")}
              />
              {errors.address?.phone && (
                <p className="text-xs text-red-500">
                  {errors.address.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-line1">ที่อยู่</Label>
              <Input
                id="addr-line1"
                placeholder="บ้านเลขที่ ถนน ซอย"
                {...register("address.addressLine1")}
              />
              {errors.address?.addressLine1 && (
                <p className="text-xs text-red-500">
                  {errors.address.addressLine1.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-line2">ที่อยู่เพิ่มเติม (ถ้ามี)</Label>
              <Input
                id="addr-line2"
                placeholder="อาคาร ชั้น ห้อง"
                {...register("address.addressLine2")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="addr-subDistrict">ตำบล/แขวง</Label>
                <Input
                  id="addr-subDistrict"
                  placeholder="ตำบล/แขวง"
                  {...register("address.subDistrict")}
                />
                {errors.address?.subDistrict && (
                  <p className="text-xs text-red-500">
                    {errors.address.subDistrict.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-district">อำเภอ/เขต</Label>
                <Input
                  id="addr-district"
                  placeholder="อำเภอ/เขต"
                  {...register("address.district")}
                />
                {errors.address?.district && (
                  <p className="text-xs text-red-500">
                    {errors.address.district.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="addr-province">จังหวัด</Label>
                <Input
                  id="addr-province"
                  placeholder="จังหวัด"
                  {...register("address.province")}
                />
                {errors.address?.province && (
                  <p className="text-xs text-red-500">
                    {errors.address.province.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-postalCode">รหัสไปรษณีย์</Label>
                <Input
                  id="addr-postalCode"
                  placeholder="xxxxx"
                  {...register("address.postalCode")}
                />
                {errors.address?.postalCode && (
                  <p className="text-xs text-red-500">
                    {errors.address.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
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
