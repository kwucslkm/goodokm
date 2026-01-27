"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSubscriptionsByUser, updateSubscription } from "@/src/lib/api";
import SubscriptionList from "@/src/components/SubscriptionList";
import type { Subscription } from "@/src/lib/api";

export default function CanceledSubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchSubscriptionsByUser(userId)
      .then((data) => {
        setSubscriptions(data.filter((item) => item.status === "DELETE"));
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "구독 정보를 불러오지 못했습니다."
        );
      });
  }, [router]);

  async function handleRestore(target: Subscription) {
    const confirmed = window.confirm("이 구독을 다시 활성화할까요?");
    if (!confirmed) {
      return;
    }

    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    setActionMessage("");

    try {
      await updateSubscription(target.id, {
        name: target.name,
        category: target.category,
        billingCycle: target.billing_cycle,
        amount: target.amount,
        nextBillingDate: target.next_billing_date,
        status: "ACTIVE",
        memo: target.memo ?? undefined,
      });
      const refreshed = await fetchSubscriptionsByUser(userId);
      setSubscriptions(refreshed.filter((item) => item.status === "DELETE"));
    } catch (error) {
      setActionMessage(
        error instanceof Error ? error.message : "재구독 처리에 실패했습니다."
      );
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">해지된 구독 목록</h1>
          <p className="text-sm text-[var(--muted)]">
            해지된 구독만 모아서 확인합니다.
          </p>
        </div>

        {status === "loading" ? (
          <p className="text-sm text-[var(--muted)]">불러오는 중...</p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-[#c0392b]">{message}</p>
        ) : null}

        {status === "ready" ? (
          <div className="surface-card rounded-[28px] p-6">
            {actionMessage ? (
              <p className="mb-3 text-sm text-[#c0392b]">{actionMessage}</p>
            ) : null}
            <SubscriptionList
              subscriptions={subscriptions}
              onRestore={handleRestore}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
