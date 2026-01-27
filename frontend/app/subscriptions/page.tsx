"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSubscription, fetchSubscriptionsByUser, updateSubscription } from "@/src/lib/api";
import SubscriptionList from "@/src/components/SubscriptionList";
import type { Subscription } from "@/src/lib/api";

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "error">(
    "idle"
  );
  const [formMessage, setFormMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  function sortByCreatedAt(items: Subscription[]) {
    return [...items].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchSubscriptionsByUser(userId)
      .then((data) => {
        setSubscriptions(sortByCreatedAt(data).filter((item) => item.status !== "DELETE"));
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "구독 정보를 불러오지 못했습니다."
        );
      });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const userId = Number(localStorage.getItem("userId"));

    if (!userId) {
      router.push("/login");
      return;
    }

    setFormStatus("loading");
    setFormMessage("");

    try {
      await createSubscription({
        userId,
        name: String(formData.get("name") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        billingCycle: String(formData.get("billingCycle") ?? ""),
        amount: Number(formData.get("amount")),
        nextBillingDate: String(formData.get("nextBillingDate") ?? ""),
        memo: String(formData.get("memo") ?? "").trim() || undefined,
      });
      form.reset();
      setShowForm(false);
      const refreshed = await fetchSubscriptionsByUser(userId);
      setSubscriptions(sortByCreatedAt(refreshed).filter((item) => item.status !== "DELETE"));
    } catch (error) {
      setFormStatus("error");
      setFormMessage(
        error instanceof Error ? error.message : "구독 등록에 실패했습니다."
      );
    } finally {
      setFormStatus("idle");
    }
  }

  async function handleDelete(target: Subscription) {
    const confirmed = window.confirm("이 구독을 삭제할까요?");
    if (!confirmed) {
      return;
    }

    const userId = Number(localStorage.getItem("userId"));
    if (!userId) {
      router.push("/login");
      return;
    }

    setDeleteMessage("");

    try {
      await updateSubscription(target.id, {
        name: target.name,
        category: target.category,
        billingCycle: target.billing_cycle,
        amount: target.amount,
        nextBillingDate: target.next_billing_date,
        status: "DELETE",
        memo: target.memo ?? undefined,
      });
      const refreshed = await fetchSubscriptionsByUser(userId);
      setSubscriptions(sortByCreatedAt(refreshed).filter((item) => item.status !== "DELETE"));
    } catch (error) {
      setDeleteMessage(
        error instanceof Error ? error.message : "구독 삭제에 실패했습니다."
      );
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">구독 관리</h1>
            <p className="text-sm text-[#4e4a42]">
              구독을 추가하고 목록을 확인하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="btn-primary-inline"
          >
            새 구독 추가
          </button>
        </div>

        {showForm ? (
          <div className="surface-card rounded-[24px] p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="field-label">구독 이름</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Netflix"
                    className="field-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="field-label">카테고리</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="VIDEO"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="field-label">결제 주기</label>
                  <select name="billingCycle" className="field-input" required>
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
                    placeholder="17000"
                    className="field-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="field-label">구독 시작일(결제일)</label>
                  <input
                    type="date"
                    name="nextBillingDate"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="field-label">메모</label>
                <textarea
                  name="memo"
                  rows={3}
                  placeholder="선택사항"
                  className="field-input"
                />
              </div>

              <button
                type="submit"
                className="btn-primary text-sm shadow-[0_12px_30px_-20px_rgba(22,90,78,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? "저장 중..." : "구독 등록"}
              </button>
            </form>

            {formMessage ? (
              <p className="mt-4 text-sm text-[#c0392b]">{formMessage}</p>
            ) : null}
          </div>
        ) : null}

        {status === "loading" ? (
          <p className="text-sm text-[var(--muted)]">불러오는 중...</p>
        ) : null}

        {status === "error" ? (
          <p className="text-sm text-[#c0392b]">{message}</p>
        ) : null}

        {status === "ready" ? (
          <div className="surface-card rounded-[28px] p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">구독 목록</h2>
            </div>
            {deleteMessage ? (
              <p className="mb-3 text-sm text-[#c0392b]">{deleteMessage}</p>
            ) : null}
            <SubscriptionList
              subscriptions={subscriptions}
              onDelete={handleDelete}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
