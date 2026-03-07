"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/lib/api/auth";
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
import { SITE_NAME } from "@/lib/constants";
import { LogIn } from "lucide-react";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "กรุณากรอกอีเมลหรือเบอร์โทร"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const fillDemo = () => {
    setValue("emailOrPhone", "somchai@example.com");
    setValue("password", "demo1234");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");
    try {
      const result = await login(data);
      if (result.success && result.user) {
        setUser(result.user);
        router.push("/");
      } else {
        setError(result.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-primary">{SITE_NAME}</CardTitle>
        <CardDescription>เข้าสู่ระบบเพื่อดำเนินการต่อ</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="mb-1.5 text-xs font-semibold text-primary">
              ทดสอบระบบ — บัญชีสาธิต
            </p>
            <p className="text-xs text-muted-foreground">
              อีเมล: somchai@example.com
            </p>
            <p className="text-xs text-muted-foreground">
              รหัสผ่าน: demo1234
            </p>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-2 rounded bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/80"
            >
              เติมข้อมูลอัตโนมัติ
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="emailOrPhone">อีเมล หรือ เบอร์โทรศัพท์</Label>
            <Input
              id="emailOrPhone"
              placeholder="email@example.com หรือ 0xx-xxx-xxxx"
              {...register("emailOrPhone")}
            />
            {errors.emailOrPhone && (
              <p className="text-xs text-red-500">
                {errors.emailOrPhone.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                ลืมรหัสผ่าน?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="รหัสผ่าน"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            <LogIn className="size-4" />
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-primary hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
