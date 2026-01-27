"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubscriptionsByUser } from "@/src/lib/api";
import type { Subscription } from "@/src/lib/api";

function normalizeAmount(amount: number, cycle: string) {
  if (cycle === "YEARLY") {
    return amount;
  }
  return amount * 12;
}

function monthlyAmount(amount: number, cycle: string) {
  if (cycle === "YEARLY") {
    return Math.round(amount / 12);
  }
  return amount;
}

export default function DashboardPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchSubscriptionsByUser(userId)
      .then((data) => {
        if (data.length === 0) {
          alert("처음 이용이시니 첫 구독 정보를 입력 해주세요");
          router.push("/subscriptions/new");
          return;
        }
        setSubscriptions(data);
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "대시보드를 불러오지 못했습니다."
        );
      });
  }, [router]);

  const summary = useMemo(() => {
    const active = subscriptions.filter((item) => item.status !== "DELETE");
    const yearlyTotal = active.reduce(
      (sum, subscription) =>
        sum + normalizeAmount(subscription.amount, subscription.billing_cycle),
      0
    );
    const monthlyTotal = active.reduce(
      (sum, subscription) =>
        sum + monthlyAmount(subscription.amount, subscription.billing_cycle),
      0
    );
    const averageMonthly =
      active.length > 0 ? Math.round(monthlyTotal / active.length) : 0;
    const recent = [...active]
      .sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 3);

    return {
      yearlyTotal,
      monthlyTotal,
      averageMonthly,
      count: active.length,
      recent,
    };
  }, [subscriptions]);

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold">내 구독 요약</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/subscriptions"
              className="btn-outline inline-flex items-center justify-center text-sm"
            >
              구독 추가
            </Link>
            <Link
              href="/subscriptions/canceled"
              className="btn-outline inline-flex items-center justify-center text-sm"
            >
              해지 된 리스트 가기
            </Link>
          </div>
        </header>

        {status === "loading" ? (
          <p className="text-sm text-[var(--muted)]">불러오는 중...</p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-[#c0392b]">{message}</p>
        ) : null}

        {status === "ready" ? (
          <>
            <section className="surface-card rounded-[28px] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                내 구독정보
              </p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    현재 총 구독 수
                  </p>
                  <p className="mt-2 text-3xl font-semibold">{summary.count}개</p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    삭제 제외 기준입니다.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    연간 총 금액
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {summary.yearlyTotal.toLocaleString()}원
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    월간 구독은 연간 기준으로 환산했습니다.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    이번달 이용 금액
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {summary.monthlyTotal.toLocaleString()}원
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    연간 구독은 월 기준으로 나눠 계산했습니다.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    월 평균 금액
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {summary.averageMonthly.toLocaleString()}원
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    전체 구독 평균입니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="surface-card rounded-[28px] p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">최근 구독</h2>
                <Link
                  href="/subscriptions"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                  aria-label="구독 리스트 더보기"
                >
                  ...
                </Link>
              </div>
              {summary.recent.length === 0 ? (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  표시할 구독이 없습니다.
                </p>
              ) : (
                <div className="mt-4 space-y-3 text-sm">
                  {summary.recent.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="surface-muted flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3 text-xs sm:text-sm"
                    >
                      <span className="min-w-[120px] font-semibold">
                        {subscription.name}
                      </span>
                      <span className="text-[var(--muted)]">
                        {subscription.category}
                      </span>
                      <span className="text-[var(--muted)]">
                        {subscription.billing_cycle === "YEARLY" ? "연간" : "월간"}
                      </span>
                      <span className="text-[var(--muted)]">
                        {subscription.next_billing_date}
                      </span>
                      <span className="font-semibold text-[var(--accent-strong)]">
                        {subscription.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
