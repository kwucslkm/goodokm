"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSubscriptionById } from "@/src/lib/api";
import type { Subscription } from "@/src/lib/api";

type BillingHistoryItem = {
  date: string;
  amount: number;
  status: string;
};

type BillingHistoryGroup = {
  year: number;
  items: BillingHistoryItem[];
  totalAmount: number;
};

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function addYears(date: Date, years: number) {
  const copy = new Date(date);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

function buildBillingHistory(subscription: Subscription | null): BillingHistoryItem[] {
  if (!subscription?.next_billing_date) {
    return [];
  }

  const start = new Date(`${subscription.next_billing_date}T00:00:00`);
  if (Number.isNaN(start.getTime())) {
    return [];
  }

  const isYearly = subscription.billing_cycle === "YEARLY";
  const step = isYearly ? 12 : 1;
  const history: BillingHistoryItem[] = [];

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let cursor = new Date(start);
  while (cursor <= todayDate) {
    history.push({
      date: formatDate(cursor),
      amount: subscription.amount,
      status: "PAID",
    });
    cursor = addMonths(cursor, step);
  }

  return history;
}

function groupHistoryByYear(items: BillingHistoryItem[]): BillingHistoryGroup[] {
  const map = new Map<number, BillingHistoryItem[]>();
  items.forEach((item) => {
    const year = Number(item.date.slice(0, 4));
    if (!map.has(year)) {
      map.set(year, []);
    }
    map.get(year)?.push(item);
  });

  return Array.from(map.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, groupItems]) => ({
      year,
      items: groupItems.sort((a, b) => b.date.localeCompare(a.date)),
      totalAmount: groupItems.reduce((sum, item) => sum + item.amount, 0),
    }));
}

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const idString = typeof rawId === "string" ? rawId : rawId?.[0] ?? "";
  const id = Number(idString);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const history = buildBillingHistory(subscription);
  const historyGroups = groupHistoryByYear(history);
  const totalPaidAmount = history.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!Number.isFinite(id)) {
      setStatus("error");
      setMessage("잘못된 구독 ID 입니다.");
      return;
    }

    fetchSubscriptionById(id)
      .then((data) => {
        setSubscription(data);
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "구독 정보를 불러오지 못했습니다."
        );
      });
  }, [id, router]);

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">구독 상세</h1>
            <p className="text-sm text-[var(--muted)]">
              구독 정보를 확인하고 수정하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/subscriptions" className="btn-outline">
              목록으로
            </Link>
            <Link href={`/subscriptions/${idString}/edit`} className="btn-outline">
              수정
            </Link>
          </div>
        </div>

        {status === "loading" ? (
          <p className="text-sm text-[var(--muted)]">불러오는 중...</p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-[#c0392b]">{message}</p>
        ) : null}

        {status === "ready" && subscription ? (
          <div className="surface-card rounded-[28px] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="field-label">서비스</p>
                <p className="mt-2 text-lg font-semibold">{subscription.name}</p>
              </div>
              <div>
                <p className="field-label">카테고리</p>
                <p className="mt-2 text-lg font-semibold">
                  {subscription.category}
                </p>
              </div>
              <div>
                <p className="field-label">결제 주기</p>
                <p className="mt-2 text-lg font-semibold">
                  {subscription.billing_cycle === "YEARLY" ? "연간" : "월간"}
                </p>
              </div>
              <div>
                <p className="field-label">금액</p>
                <p className="mt-2 text-lg font-semibold">
                  {subscription.amount.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="field-label">구독 시작일(결제일)</p>
                <p className="mt-2 text-lg font-semibold">
                  {subscription.next_billing_date}
                </p>
              </div>
              <div>
                <p className="field-label">상태</p>
                <p className="mt-2 text-lg font-semibold">
                  {subscription.status}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="field-label">메모</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {subscription.memo ?? "-"}
                </p>
              </div>
              <div>
                <p className="field-label">누적 결제 금액</p>
                <p className="mt-2 text-lg font-semibold">
                  {totalPaidAmount.toLocaleString()}원
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  구독 시작일부터 오늘까지 누적
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {status === "ready" && subscription ? (
          <div className="surface-card rounded-[28px] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">결제 히스토리</h2>
              <span className="text-xs text-[var(--muted)]">
                {subscription.billing_cycle === "YEARLY" ? "연간" : "월간"} 기준
              </span>
            </div>
            {historyGroups.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">
                결제 이력이 없습니다.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {historyGroups.map((group) => (
                  <details key={group.year} className="surface-muted px-3 py-2">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm font-semibold">
                      <span>{group.year}년</span>
                      <span className="text-xs text-[var(--muted)]">
                        {group.items.length}건 · {group.totalAmount.toLocaleString()}원
                      </span>
                    </summary>
                    <div className="pb-2">
                      <table className="w-full min-w-[520px] border-separate border-spacing-y-2 text-left text-sm">
                        <thead className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          <tr>
                            <th className="px-3">결제일</th>
                            <th className="px-3">금액</th>
                            <th className="px-3">상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr key={item.date} className="surface-muted">
                              <td className="px-3 py-2 font-semibold">
                                {item.date}
                              </td>
                              <td className="px-3 py-2">
                                {item.amount.toLocaleString()}원
                              </td>
                              <td className="px-3 py-2">{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
