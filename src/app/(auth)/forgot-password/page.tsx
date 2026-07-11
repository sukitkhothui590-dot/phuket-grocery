"use client";

import { useState } from "react";
import Link from "next/link";
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
import { requestPasswordReset } from "@/lib/api/auth";
import { SITE_NAME } from "@/lib/constants";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลที่ถูกต้อง"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    setError("");

    const result = await requestPasswordReset(data.email);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้");
      return;
    }

    setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">{SITE_NAME}</CardTitle>
        <CardDescription>รีเซ็ตรหัสผ่าน</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">ส่งอีเมลเรียบร้อยแล้ว</p>
              <p className="mt-1 text-sm text-muted-foreground">
                กรุณาตรวจสอบกล่องจดหมายของคุณ เพื่อรีเซ็ตรหัสผ่าน
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              กรอกอีเมลที่ใช้สมัครสมาชิก
              เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ
            </p>
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
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <Mail className="size-4" />
              {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
            </Button>
            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
