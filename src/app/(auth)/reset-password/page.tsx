"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { resetPassword } from "@/lib/api/auth";
import { SITE_NAME } from "@/lib/constants";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";

const resetSchema = z
  .object({
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      setError("ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ");
      return;
    }

    setLoading(true);
    setError("");

    const result = await resetPassword(token, data.password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "ไม่สามารถรีเซ็ตรหัสผ่านได้");
      return;
    }

    setSubmitted(true);
  };

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง กรุณาขอลิงก์ใหม่
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          ขอลิงก์รีเซ็ตรหัสผ่าน
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-6 text-green-600" />
        </div>
        <div>
          <p className="font-medium">รีเซ็ตรหัสผ่านสำเร็จ</p>
          <p className="mt-1 text-sm text-muted-foreground">
            คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          ไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="password">รหัสผ่านใหม่</Label>
        <Input
          id="password"
          type="password"
          placeholder="อย่างน้อย 8 ตัวอักษร"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        <KeyRound className="size-4" />
        {loading ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
      </Button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">{SITE_NAME}</CardTitle>
        <CardDescription>ตั้งรหัสผ่านใหม่</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <p className="text-center text-sm text-muted-foreground">
              กำลังโหลด...
            </p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
