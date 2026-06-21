import { getAccessToken } from "./authentication";
import { getApiUrl } from "./getApiUrl";

export async function checkInStreak(): Promise<{
  success: boolean;
  isNewCheckIn: boolean;
  message?: string;
}> {
  try {
    const url = getApiUrl("api/account/check-in");
    const token = await getAccessToken();

    if (!url) {
      return { success: false, isNewCheckIn: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, isNewCheckIn: false, message: "You are not signed in." };
    }

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let message: string | undefined;
    try {
      const data = await r.json();
      if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
        message = data.message;
      }
    } catch {}

    if (!r.ok) {
      return { success: false, isNewCheckIn: false, message: message ?? "Unable to complete check-in." };
    }

    const alreadyCheckedIn = message?.toLowerCase().includes("already checked in");
    return { success: true, isNewCheckIn: !alreadyCheckedIn, message };
  } catch {
    return { success: false, isNewCheckIn: false, message: "Unable to complete check-in." };
  }
}
