import { getAccessToken } from "./authentication";
import { getApiUrl } from "./getApiUrl";

export type Wallet = {
  id: number;
  asset: string;
  asset_name: string;
  balance: string;
  value: string | null;
  icon: string;
  is_preferred: boolean;
};

export type WalletResponse = {
  data: Wallet[];
  current_page: number;
  per_page: number;
  total_pages: number;
};

export type GetWalletResult = {
  success: boolean;
  message?: string;
  data?: WalletResponse;
};

export async function getWallet(): Promise<GetWalletResult> {
  try {
    const url = getApiUrl("/api/account/wallets?page=1&per_page=10&order_by=balance&order_direction=desc");
    const token = await getAccessToken();

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, message: "You are not signed in." };
    }

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!r.ok) {
      return { success: false, message: "Unable to load wallet data." };
    }

    const data: WalletResponse = await r.json();
    return { success: true, data };
  } catch {
    return { success: false, message: "Unable to load wallet data." };
  }
}

export type Transaction = {
  id: number;
  type: string;
  status: string;
  amount: string;
  asset?: string;
  created_at: string;
  [key: string]: unknown;
};

export type TransactionResponse = {
  data: Transaction[];
  current_page: number;
  per_page: number;
  total_pages: number;
};

export type GetTransactionsResult = {
  success: boolean;
  message?: string;
  data?: TransactionResponse;
};

export type TransactionParams = {
  page?: number;
  per_page?: number;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
};

export async function getTransactions(params: TransactionParams = {}): Promise<GetTransactionsResult> {
  try {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("per_page", String(params.per_page ?? 10));
    if (params.type) query.set("type", params.type);
    if (params.status) query.set("status", params.status);
    if (params.start_date) query.set("start_date", params.start_date);
    if (params.end_date) query.set("end_date", params.end_date);

    const url = getApiUrl(`/api/account/wallets/transactions?${query.toString()}`);
    const token = await getAccessToken();

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, message: "You are not signed in." };
    }

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!r.ok) {
      return { success: false, message: "Unable to load transactions." };
    }

    const data: TransactionResponse = await r.json();
    return { success: true, data };
  } catch {
    return { success: false, message: "Unable to load transactions." };
  }
}

export type WalletActionResult = {
  success: boolean;
  message?: string;
};

export async function setPreferredWallet(asset: string): Promise<WalletActionResult> {
  try {
    const url = getApiUrl(`/api/account/wallets/set-preferred/${asset}`);
    const token = await getAccessToken();

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, message: "You are not signed in." };
    }

    const r = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data: unknown = null;
    try {
      data = await r.json();
    } catch {}

    if (!r.ok) {
      if (data && typeof data === "object" && "message" in data) {
        const message = data.message;
        if (typeof message === "string" && message.trim()) {
          return { success: false, message };
        }
      }

      return { success: false, message: "Unable to set preferred wallet." };
    }

    return { success: true, message: "Preferred wallet updated successfully." };
  } catch {
    return { success: false, message: "Unable to set preferred wallet." };
  }
}


