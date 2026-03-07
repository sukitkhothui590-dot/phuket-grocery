"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="bg-[#01A1AF]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <h2 className="text-xl font-bold text-white lg:text-2xl">
            รับข่าวสาร & โปรโมชั่นพิเศษ
          </h2>
          <p className="mt-1 text-sm text-white/70">
            สมัครรับข่าวสาร รับส่วนลดพิเศษก่อนใคร ไม่พลาดทุกดีล
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md overflow-hidden rounded-lg bg-white"
        >
          <input
            type="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-slate-800 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            {submitted ? (
              <>
                <CheckCircle className="h-4 w-4" />
                สำเร็จ
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                สมัคร
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
