"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubscriptionsByUser } from "@/src/lib/api";
import SubscriptionList from "@/src/components/SubscriptionList";
import type { Subscription } from "@/src/lib/api";

export default function SubscriptionsPage() {
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
        setSubscriptions(data);
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "구독 정보를 불러오지 못했습니다."
        );
      });
  }, [router]);

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">구독 목록</h1>
            <p className="text-sm text-[#4e4a42]">
              등록된 구독을 확인하고 관리하세요.
            </p>
          </div>
          <Link
            href="/subscriptions/new"
            className="btn-outline inline-flex items-center justify-center text-sm"
          >
            새 구독 추가
          </Link>
        </div>

        {status === "loading" ? (
          <p className="text-sm text-[var(--muted)]">불러오는 중...</p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-[#c0392b]">{message}</p>
        ) : null}

        {status === "ready" ? (
          <div className="surface-card rounded-[28px] p-6">
            <SubscriptionList subscriptions={subscriptions} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
