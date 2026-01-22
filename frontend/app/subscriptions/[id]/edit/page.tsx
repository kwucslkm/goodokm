"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSubscriptionById, updateSubscription } from "@/src/lib/api";
import type { Subscription } from "@/src/lib/api";

export default function SubscriptionEditPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const idString = typeof rawId === "string" ? rawId : rawId?.[0] ?? "";
  const id = Number(idString);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!Number.isFinite(id)) {
      setMessage("잘못된 구독 ID 입니다.");
      return;
    }

    try {
      await updateSubscription(id, {
        name: String(formData.get("name") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        billingCycle: String(formData.get("billingCycle") ?? ""),
        amount: Number(formData.get("amount")),
        nextBillingDate: String(formData.get("nextBillingDate") ?? ""),
        status: String(formData.get("status") ?? "ACTIVE"),
        memo: String(formData.get("memo") ?? "").trim() || undefined,
      });
      router.push(`/subscriptions/${idString}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "구독 수정에 실패했습니다."
      );
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">구독 수정</h1>
            <p className="text-sm text-[var(--muted)]">
              정보를 수정한 뒤 저장하세요.
            </p>
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
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="field-label">구독 이름</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={subscription.name}
                    className="field-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="field-label">카테고리</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={subscription.category}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="field-label">결제 주기</label>
                  <select
                    name="billingCycle"
                    defaultValue={subscription.billing_cycle}
                    className="field-input"
                    required
                  >
                    <option value="MONTHLY">월간</option>
                    <option value="YEARLY">연간</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="field-label">금액</label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    defaultValue={subscription.amount}
                    className="field-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="field-label">구독 시작일(결제일)</label>
                  <input
                    type="date"
                    name="nextBillingDate"
                    defaultValue={subscription.next_billing_date}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="field-label">상태</label>
                  <select
                    name="status"
                    defaultValue={subscription.status}
                    className="field-input"
                    required
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="field-label">메모</label>
                  <input
                    type="text"
                    name="memo"
                    defaultValue={subscription.memo ?? ""}
                    className="field-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary text-sm shadow-[0_12px_30px_-20px_rgba(22,90,78,0.5)]"
              >
                수정 저장
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
