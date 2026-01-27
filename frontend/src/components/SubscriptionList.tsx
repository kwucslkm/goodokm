import Link from "next/link";
import type { Subscription } from "@/src/lib/api";

type SubscriptionListProps = {
  subscriptions: Subscription[];
  onDelete?: (subscription: Subscription) => void;
  onRestore?: (subscription: Subscription) => void;
};

export default function SubscriptionList({
  subscriptions,
  onDelete,
  onRestore,
}: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return <p className="text-sm text-[var(--muted)]">구독이 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-y-3 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          <tr>
            <th className="px-4">서비스</th>
            <th className="px-4">카테고리</th>
            <th className="px-4">구독시작일</th>
            <th className="px-4">이용 구분</th>
            <th className="px-4">이용 금액</th>
            <th className="px-4">상태</th>
            <th className="px-4">관리</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr
              key={subscription.id}
              className="bg-[var(--surface-strong)] shadow-sm"
            >
              <td className="px-4 py-3 font-semibold first:rounded-l-2xl">
                <Link
                  href={`/subscriptions/${subscription.id}`}
                  className="text-[var(--foreground)] transition hover:text-[var(--accent-strong)]"
                >
                  {subscription.name}
                </Link>
              </td>
              <td className="px-4 py-3">{subscription.category}</td>
              <td className="px-4 py-3">{subscription.next_billing_date}</td>
              <td className="px-4 py-3">
                {subscription.billing_cycle === "YEARLY" ? "연간" : "월간"}
              </td>
              <td className="px-4 py-3 font-semibold text-[var(--accent)]">
                {subscription.amount.toLocaleString()}원
              </td>
              <td className="px-4 py-3">
                {subscription.status}
              </td>
              <td className="px-4 py-3 last:rounded-r-2xl">
                <div className="flex items-center gap-2">
                  {onRestore ? (
                    <button
                      type="button"
                      onClick={() => onRestore(subscription)}
                      className="rounded-md border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-emerald-400 hover:text-emerald-500"
                    >
                      재구독
                    </button>
                  ) : null}
                  {onDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(subscription)}
                    className="rounded-md border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)] transition hover:border-red-400 hover:text-red-500"
                  >
                    삭제
                  </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
