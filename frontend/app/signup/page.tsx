"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/lib/api";

export default function SignupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setStatus("loading");
    setMessage("");

    try {
      await registerUser({ email, password });
      form.reset();
      setStatus("success");
      alert(`${email} 님 가입을 축하합니다. 로그인 하세요`);
      router.push("/login?focus=email");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다."
      );
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col justify-center gap-10">
        <div className="surface-card rounded-[28px] p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">회원가입</h1>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Create
            </span>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="field-label">
                아이디(이메일)
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="field-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="field-label">
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                className="field-input"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary text-sm shadow-lg shadow-[rgba(30,107,214,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "loading"}
            >
              {status === "loading" ? "가입 중..." : "회원가입"}
            </button>
          </form>

          {message ? (
            <p
              className={`mt-4 text-sm ${
                status === "success" ? "text-[#2e7d64]" : "text-[#c0392b]"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              href="/login"
              className="font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
