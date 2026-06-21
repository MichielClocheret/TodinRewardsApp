import { getAccessToken } from "./authentication";
import { getApiUrl } from "./getApiUrl";

export type WithdrawPayload = {
  amount: number;
  destination_address: string;
};

export type WithdrawResult = {
  success: boolean;
  message?: string;
};

export async function requestWithdrawal(
  asset: string,
  payload: WithdrawPayload,
): Promise<WithdrawResult> {
  try {
    const url = getApiUrl(
      `/api/account/wallets/${asset.toLowerCase()}/request-withdrawal`,
    );
    const token = await getAccessToken();

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, message: "You are not signed in." };
    }

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
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

      return { success: false, message: "Unable to request withdrawal." };
    }

    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string" && message.trim()) {
        return { success: true, message };
      }
    }

    return { success: true, message: "Withdrawal request submitted." };
  } catch {
    return { success: false, message: "Unable to request withdrawal." };
  }
}
