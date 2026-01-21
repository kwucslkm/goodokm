"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setEmail(localStorage.getItem("userEmail"));
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    document.body.dataset.theme = initial;
  }, []);

  function handleHomeClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (localStorage.getItem("userId")) {
      router.push("/dashboard");
      return;
    }
    router.push("/login");
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    router.push("/login");
  }

  function toggleTheme() {
    const current =
      document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
    document.body.dataset.theme = next;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          onClick={handleHomeClick}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
          aria-label="홈으로 이동"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5 10.5V20h14v-9.5" />
              <path d="M9 20v-5h6v5" />
            </svg>
          </span>
          Home
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {email ? (
            <>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                {email}
              </span>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="btn-outline"
              >
                대시보드 가기
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-95"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="btn-outline"
            >
              로그인
            </button>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="다크 모드 변경"
          >
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.9 4.9l1.4 1.4" />
                <path d="M17.7 17.7l1.4 1.4" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="M4.9 19.1l1.4-1.4" />
                <path d="M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
