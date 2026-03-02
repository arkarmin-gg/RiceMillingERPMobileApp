import { Platform } from "react-native";

// const API_BASE_URL = "http://192.168.1.4:8000/api/v1";
// const API_BASE_URL = "http://192.168.0.205:8000/api/v1";

// Android Emulator uses 10.0.2.2 for localhost
// For physical device, use your machine's LAN IP (e.g. 192.168.x.x)
const API_BASE_URL = Platform.select({
  // android: "http://10.0.2.2:8000/api/v1",
  android: "http://192.168.1.2:8000/api/v1",
  ios: "http://localhost:8000/api/v1",
  default: "http://localhost:8000/api/v1",
});

type ApiFetchOptions = RequestInit & {
  authToken?: string | null;
  timeout?: number;
};

async function apiFetch<TResponse = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const { authToken, headers, body, timeout = 15000, ...rest } = options;

  const mergedHeaders: Record<string, string> = {
    Accept: "application/json",
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
        "Request timed out. Please check your network connection.",
      );
    }
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
