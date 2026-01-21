import type { Subscription } from "@/src/lib/api";

type SubscriptionListProps = {
  subscriptions: Subscription[];
};

export default function SubscriptionList({
  subscriptions,
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
            <th className="px-4">결제일</th>
            <th className="px-4">이용 구분</th>
            <th className="px-4">이용 금액</th>
            <th className="px-4">상태</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr
              key={subscription.id}
              className="bg-[var(--surface-strong)] shadow-sm"
            >
              <td className="px-4 py-3 font-semibold first:rounded-l-2xl">
                {subscription.name}
              </td>
              <td className="px-4 py-3">{subscription.next_billing_date}</td>
              <td className="px-4 py-3">
                {subscription.billing_cycle === "YEARLY" ? "연간" : "월간"}
              </td>
              <td className="px-4 py-3 font-semibold text-[var(--accent)]">
                {subscription.amount.toLocaleString()}원
              </td>
              <td className="px-4 py-3 last:rounded-r-2xl">
                {subscription.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
