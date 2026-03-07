"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Mail className="size-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-green-800">
          ส่งข้อความสำเร็จ!
        </h3>
        <p className="mt-2 text-sm text-green-700">
          ขอบคุณที่ติดต่อเรา เราจะตอบกลับโดยเร็วที่สุด
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setSubmitted(false)}
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">ชื่อ-สกุล</Label>
        <Input id="name" name="name" required className="mt-1.5" placeholder="กรอกชื่อ-สกุล" />
      </div>
      <div>
        <Label htmlFor="email">อีเมล</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" placeholder="example@email.com" />
      </div>
      <div>
        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
        <Input id="phone" name="phone" type="tel" className="mt-1.5" placeholder="0xx-xxx-xxxx" />
      </div>
      <div>
        <Label htmlFor="message">ข้อความ</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5"
          placeholder="พิมพ์ข้อความของคุณที่นี่..."
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  );
}
