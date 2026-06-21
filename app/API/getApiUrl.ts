export const API = process.env.EXPO_PUBLIC_APIROUTE;


export function getApiUrl(path: string): string | null {
  if (!API) {
    return null;
  }

  const baseUrl = API.endsWith("/") ? API : `${API}/`;
  return `${baseUrl}${path}`;
}