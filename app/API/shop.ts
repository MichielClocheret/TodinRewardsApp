import { getApiUrl } from "./getApiUrl";

export type Shop = {
  id: number;
  name: string;
  description: string;
  logo: string;
  locale: string;
  url: string;
  spending_reward: number;
  spending_reward_tooltip?: string | null;
  bonus_reward?: number | null;
  bonus_reward_starts_at?: string | null;
  bonus_reward_ends_at?: string | null;
};

export type GetShopsResult = {
  success: boolean;
  message?: string;
  shops?: Shop[];
};

type ShopsApiResponse = | Shop[] | {
      data?: Shop[];
      shops?: Shop[];
    };

export async function getShops(): Promise<GetShopsResult> {
  try {
    const url = getApiUrl("api/shops?page=1&per_page=16");

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    const r = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US",
        'X-Domain': 'todin.app',
      },
    });

    let data: ShopsApiResponse | null = null;

    try {
      data = await r.json();
    } catch (e) {
      // console.log("[shops] Failed to parse JSON:", e);
    }

    if (!r.ok) {
      // console.log("[shops] Request failed:", r.status, data);
      return { success: false, message: "Unable to load shops." };
    }

    const shops = Array.isArray(data)
      ? data
      : data?.data || data?.shops || [];

    return { success: true, shops };
  } catch (err) {
    // console.log("[shops] Exception:", err);
    return { success: false, message: "Unable to load shops." };
  }
}
