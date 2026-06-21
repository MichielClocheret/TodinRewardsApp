import { getAccessToken } from "./authentication";
import { getApiUrl } from "./getApiUrl";

export type Referral = {
  referral_code: string;
  totals: {
    total_earned: number;
    total_created: number;
    total_completed: number;
  };
  in_progress: ReferralItem[];
  history: ReferralItem[];
};

export type ReferralItem = {
  name: string;
  progress: number;
  expiry: string;
  reward: number;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
};

export type GetReferralResult = {
  success: boolean;
  message?: string;
  data?: Referral;
};

export async function getReferral(): Promise<GetReferralResult> {
  try {
    const url = getApiUrl("api/account/referrals");
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
      return { success: false, message: "Unable to load referral data." };
    }

    const data: Referral = await r.json();
    return { success: true, data };
  } catch {
    return { success: false, message: "Unable to load referral data." };
  }
}
