import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from './getApiUrl';

export type LoginResponse = {
  token: string;
  refresh_token: string;
};

export type AccountInfo = {
  id?: number;
  email?: string;
  email_verified_at?: string | null;
  [key: string]: unknown;
};

export type CommonResult = {
  success: boolean;
  message?: string;
};

export type RegisterResponseUser = {
  email?: string;
  first_name?: string;
  last_name?: string;
  language_choice?: string;
  login_streak?: number;
  notification_preferences?: Record<string, boolean>;
  preferred_locale?: string;
  referral_code?: string;
  referred_by?: string | null;
  status?: string;
  tracking_code?: string;
  username?: string;
  [key: string]: unknown;
};

export type RegisterResult = CommonResult & {
  data?: {
    message?: string;
    user?: RegisterResponseUser;
  };
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email?: string;
  showNsfw?: boolean;
  notificationPreferences?: Record<string, boolean>;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};


const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REFRESH_EXPIRES_AT_KEY = 'refreshTokenExpiresAt';


export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResult> {
  try {
    const url = getApiUrl("api/account/register");

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    // console.log('[register] POST', url, { firstname: firstName, lastname: lastName, email });
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US',
        'X-Domain': 'todin.app',
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        password_confirmation: confirmPassword,
      }),
    });

    let data: unknown = {};
    try {
      data = await r.json();
    } catch (e) {
      // console.log('[register] Failed to parse JSON:', e);
    }
    // console.log('[register] Response status:', r.status, 'data:', data);

    if (!r.ok) {
      if (r.status === 422) {
        if (data && typeof data === 'object' && 'errors' in data && (data as any).errors?.email) {
          // console.log('[register] Email already in use error:', (data as any).errors.email);
          return { success: false, message: 'Email is already in use.' };
        }
        // console.log('[register] Validation failed:', data);
        return { success: false, message: 'Validation failed.' };
      }
      // console.log('[register] Registration failed:', data);
      return { success: false, message: 'Registration failed.' };
    }

    return {
      success: true,
      data: data && typeof data === "object" ? (data as RegisterResult["data"]) : undefined,
    };
  } catch (err) {
    // console.log('[register] Exception:', err);
    return { success: false, message: 'Registration failed.' };
  }
}

export async function checkEmail(email: string): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/check-email");

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (r.ok) {
      return { success: true, message: 'Email is available' };
    }

    if (r.status === 422) {
      return { success: false, message: 'Email is already in use.' };
    }

    return { success: false, message: 'Unable to verify email.' };
  } catch {
    return { success: false, message: 'Unable to verify email.' };
  }
}

async function saveAuthTokens(data: LoginResponse) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);

  const expiresInMs = 30 * 24 * 60 * 60 * 1000;
  await SecureStore.setItemAsync(
    REFRESH_EXPIRES_AT_KEY,
    String(Date.now() + expiresInMs)
  );
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function clearAuthTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_EXPIRES_AT_KEY);
}

export async function login(
  email: string,
  password: string
): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/login");

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!r.ok) {
      return {
        success: false,
        message:
          r.status === 401
            ? 'Incorrect email or password.'
            : 'Unable to sign in. Please try again.',
      };
    }

    const data: LoginResponse = await r.json();
    await saveAuthTokens(data);

    return { success: true };
  } catch {
    return { success: false, message: 'Server error. Please try again later.' };
  }
}

export async function isStoredLoginValid(): Promise<boolean>{
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const expiresAt = await SecureStore.getItemAsync(REFRESH_EXPIRES_AT_KEY);

  if (!token || !expiresAt) {
    return false;
  }

  return Date.now() < Number(expiresAt);
}


export async function getAccountInfo(): Promise<{
  success: boolean;
  message?: string;
  data?: AccountInfo;
}> {
  try {
    const url = getApiUrl("api/account/info");
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
      return { success: false, message: "Unable to load account info." };
    }

    const data: AccountInfo = await r.json();
    return { success: true, data };
  } catch {
    return { success: false, message: "Unable to load account info." };
  }
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/update-profile");
    const token = await getAccessToken();

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    if (!token) {
      return { success: false, message: "You are not signed in." };
    }

    const requestBody: Record<string, unknown> = {
      firstname: payload.firstName,
      lastname: payload.lastName,
    };

    if (payload.email) {
      requestBody.new_email = payload.email;
    }

    if (typeof payload.showNsfw === "boolean") {
      requestBody.show_nsfw = payload.showNsfw;
    }

    if (payload.notificationPreferences) {
      requestBody.notification_preferences = payload.notificationPreferences;
    }

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": "en-US",
        'X-Domain': 'todin.app',
      },
      body: JSON.stringify(requestBody),
    });

    let data: unknown = null;
    try {
      data = await r.json();
    } catch {}

    if (!r.ok) {
      if (
        data &&
        typeof data === "object" &&
        "errors" in data &&
        data.errors &&
        typeof data.errors === "object"
      ) {
        const firstError = Object.values(data.errors as Record<string, unknown>)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .find((value) => typeof value === "string");

        if (typeof firstError === "string") {
          return { success: false, message: firstError };
        }
      }

      if (data && typeof data === "object" && "message" in data) {
        const message = data.message;
        if (typeof message === "string" && message.trim()) {
          return { success: false, message };
        }
      }

      return { success: false, message: "Unable to save profile changes." };
    }

    return { success: true, message: "Profile updated successfully." };
  } catch {
    return { success: false, message: "Unable to save profile changes." };
  }
}

export async function resendVerificationEmail(): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/email/resend-verification");
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
    });

    if (!r.ok) {
      return { success: false, message: "Unable to resend verification email." };
    }

    return { success: true, message: "Verification email sent again." };
  } catch {
    return { success: false, message: "Unable to resend verification email." };
  }
}

export async function forgotPassword(email: string): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/forgot-password");

    if (!url) {
      return { success: false, message: "API URL is not configured." };
    }

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en-US",
        "X-Domain": "todin.app",
      },
      body: JSON.stringify({ email }),
    });

    let data: unknown = null;
    try {
      data = await r.json();
    } catch {}

    if (!r.ok) {
      if (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string") {
        return { success: false, message: (data as any).message };
      }
      return { success: false, message: "Unable to send reset email." };
    }

    return { success: true, message: "Password reset email sent. Check your inbox." };
  } catch {
    return { success: false, message: "Unable to send reset email." };
  }
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<CommonResult> {
  try {
    const url = getApiUrl("api/account/update-password");
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
        "Accept-Language": "en-US",
        'X-Domain': 'todin.app',
      },
      body: JSON.stringify({
        current_password: payload.currentPassword,
        new_password: payload.newPassword,
        new_password_confirmation: payload.confirmNewPassword,
      }),
    });

    let data: unknown = null;
    try {
      data = await r.json();
    } catch {}

    if (!r.ok) {
      if (
        data &&
        typeof data === "object" &&
        "errors" in data &&
        data.errors &&
        typeof data.errors === "object"
      ) {
        const firstError = Object.values(data.errors as Record<string, unknown>)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .find((value) => typeof value === "string");

        if (typeof firstError === "string") {
          return { success: false, message: firstError };
        }
      }

      if (data && typeof data === "object" && "message" in data) {
        const message = data.message;
        if (typeof message === "string" && message.trim()) {
          return { success: false, message };
        }
      }

      return { success: false, message: "Unable to change password." };
    }

    return { success: true, message: "Password changed successfully." };
  } catch {
    return { success: false, message: "Unable to change password." };
  }
}
