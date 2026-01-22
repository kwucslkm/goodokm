"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/src/lib/api";

export default function LoginPage() {
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("focus") === "email") {
      emailInputRef.current?.focus();
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setStatus("loading");
    setMessage("");

    try {
      const result = await loginUser({ email, password });
      localStorage.setItem("userId", String(result.id));
      localStorage.setItem("userEmail", result.email);
      router.push("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "로그인에 실패했습니다."
      );
    } finally {
      setStatus("idle");
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 pt-2 sm:pt-3">
        <section className="flex flex-col gap-4">
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Goodokm
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              지출을 통제하는 가장 우아한 방법.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              구독과 결제를 한 번에 정리하고, 다음 결제일을 놓치지 마세요.
            </p>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-lg flex-col">
          <div className="surface-card rounded-[28px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">로그인</h2>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Secure
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
                  ref={emailInputRef}
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
                className="btn-primary text-sm shadow-lg shadow-[rgba(30,107,214,0.2)]"
              >
                {status === "loading" ? "로그인 중..." : "로그인"}
              </button>
            </form>

            {message ? (
              <p className="mt-4 text-sm text-[#c0392b]">{message}</p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/signup"
                className="btn-outline inline-flex items-center justify-center text-sm"
              >
                회원가입
              </Link>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  아이디(이메일) 찾기
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  비밀번호 찾기
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 text-xs text-[var(--muted)] sm:gap-4">
          <div className="surface-muted rounded-2xl px-4 py-3 shadow-sm">
            자동 알림
          </div>
          <div className="surface-muted rounded-2xl px-4 py-3 shadow-sm">
            맞춤 카테고리
          </div>
          <div className="surface-muted rounded-2xl px-4 py-3 shadow-sm">
            리포트 분석
          </div>
          <div className="surface-muted rounded-2xl px-4 py-3 shadow-sm">
            예산 관리
          </div>
        </section>
      </div>
    </main>
  );
}
