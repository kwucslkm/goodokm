export type Subscription = {
  id: number;
  user_id: number;
  name: string;
  category: string;
  billing_cycle: string;
  amount: number;
  next_billing_date: string;
  status: string;
  memo: string | null;
  created_at?: string;
  updated_at?: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  id: number;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  email: string;
};

export type SubscriptionPayload = {
  userId: number;
  name: string;
  category: string;
  billingCycle: string;
  amount: number;
  nextBillingDate: string;
  memo?: string;
};

export type SubscriptionUpdatePayload = {
  name: string;
  category: string;
  billingCycle: string;
  amount: number;
  nextBillingDate: string;
  status: string;
  memo?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type ApiSubscription = {
  id: number;
  userId?: number;
  user_id?: number;
  name: string;
  category: string;
  billingCycle?: string;
  billing_cycle?: string;
  amount: number;
  nextBillingDate?: string;
  next_billing_date?: string;
  status: string;
  memo?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

function normalizeSubscription(item: ApiSubscription): Subscription {
  return {
    id: item.id,
    user_id: item.user_id ?? item.userId ?? 0,
    name: item.name,
    category: item.category,
    billing_cycle: item.billing_cycle ?? item.billingCycle ?? "MONTHLY",
    amount: item.amount,
    next_billing_date: item.next_billing_date ?? item.nextBillingDate ?? "",
    status: item.status ?? "ACTIVE",
    memo: item.memo ?? null,
    created_at: item.created_at ?? item.createdAt,
    updated_at: item.updated_at ?? item.updatedAt,
  };
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions`
    : "/api/subscriptions";
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeSubscription) : [];
}

export async function fetchSubscriptionsByUser(
  userId: number
): Promise<Subscription[]> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions?userId=${userId}`
    : `/api/subscriptions?userId=${userId}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeSubscription) : [];
}

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/auth/register`
    : "/api/auth/register";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to register");
  }

  const data = await response.json();
  return data as RegisterResponse;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/auth/login`
    : "/api/auth/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to login");
  }

  return response.json();
}

export async function createSubscription(
  payload: SubscriptionPayload
): Promise<Subscription> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions`
    : "/api/subscriptions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create subscription");
  }

  const data = await response.json();
  return normalizeSubscription(data as ApiSubscription);
}

export async function fetchSubscriptionById(
  id: number
): Promise<Subscription> {
  if (!Number.isFinite(id)) {
    throw new Error("Invalid subscription id");
  }
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions/${id}`
    : `/api/subscriptions/${id}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription: ${response.status}`);
  }

  const data = await response.json();
  return normalizeSubscription(data as ApiSubscription);
}

export async function updateSubscription(
  id: number,
  payload: SubscriptionUpdatePayload
): Promise<Subscription> {
  if (!Number.isFinite(id)) {
    throw new Error("Invalid subscription id");
  }
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions/${id}`
    : `/api/subscriptions/${id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to update subscription");
  }

  const data = await response.json();
  return normalizeSubscription(data as ApiSubscription);
}

export async function deleteSubscription(id: number): Promise<void> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/subscriptions/${id}`
    : `/api/subscriptions/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete subscription");
  }
}
