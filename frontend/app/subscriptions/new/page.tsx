"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSubscription } from "@/src/lib/api";

export default function NewSubscriptionPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userId = Number(localStorage.getItem("userId"));

    if (!userId) {
      router.push("/login");
      return;
    }

    const payload = {
      userId,
      name: String(formData.get("name") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      billingCycle: String(formData.get("billingCycle") ?? ""),
      amount: Number(formData.get("amount")),
      nextBillingDate: String(formData.get("nextBillingDate") ?? ""),
      memo: String(formData.get("memo") ?? "").trim() || undefined,
    };

    setStatus("loading");
    setMessage("");

    try {
      await createSubscription(payload);
      router.push("/subscriptions");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "구독 등록에 실패했습니다."
      );
    } finally {
      setStatus("idle");
    }
  }

  return (
    <main className="app-shell min-h-screen px-5 py-10 text-[var(--foreground)] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="surface-card rounded-[28px] p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">새 구독 등록</h1>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              New
            </span>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="field-label">
                  구독 이름
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Netflix"
                  className="field-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="field-label">
                  카테고리
                </label>
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
                <label className="field-label">
                  결제 주기
                </label>
                <select
                  name="billingCycle"
                  className="field-input"
                  required
                >
                  <option value="MONTHLY">월간</option>
                  <option value="YEARLY">연간</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="field-label">
                  금액
                </label>
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
                <label className="field-label">
                  다음 결제일
                </label>
                <input
                  type="date"
                  name="nextBillingDate"
                  className="field-input"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="field-label">
                메모
              </label>
              <textarea
                name="memo"
                rows={3}
                placeholder="선택사항"
                className="field-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary text-sm shadow-lg shadow-[rgba(30,107,214,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={status === "loading"}
            >
              {status === "loading" ? "저장 중..." : "구독 등록"}
            </button>
          </form>

          {message ? (
            <p className="mt-4 text-sm text-[#c0392b]">{message}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
