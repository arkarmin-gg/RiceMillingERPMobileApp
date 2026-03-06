import { Platform } from "react-native";

// Android Emulator uses 10.0.2.2 for localhost
// For physical device, use your machine's LAN IP (e.g. 192.168.x.x)
// https://shwe-tharaphu-rice-milling-erp.shwecode.xyz/admin/items
const API_BASE_URL = Platform.select({
  android: "https://shwe-tharaphu-rice-milling-erp.shwecode.xyz/api/v1",
  ios: "https://shwe-tharaphu-rice-milling-erp.shwecode.xyz/api/v1",
  default: "https://shwe-tharaphu-rice-milling-erp.shwecode.xyz/api/v1",
});

type ApiFetchOptions = RequestInit & {
  authToken?: string | null;
  timeout?: number;
};

async function apiFetch<TResponse = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const { authToken, headers, body, timeout = 30000, ...rest } = options;

  const mergedHeaders: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "RiceMillingMobileApp/1.0.0",
    ...(headers as Record<string, string> | undefined),
  };

  if (!(body instanceof FormData)) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  if (authToken) {
    mergedHeaders.Authorization = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      body,
      headers: mergedHeaders,
      signal: controller.signal as AbortSignal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timed out (${timeout}ms). Please check your network connection.`,
      );
    }
    console.error("API Request Error:", error);
    throw error;
  } finally {
    clearTimeout(id);
  }

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Unexpected error. Please try again.";
    throw new Error(message);
  }

  return data as TResponse;
}

export { API_BASE_URL, apiFetch };
