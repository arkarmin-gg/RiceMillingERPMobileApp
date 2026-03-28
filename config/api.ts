const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://shwe-tharaphu-rice-milling-erp.shwecode.xyz/api/v1";

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
    if (__DEV__) {
      console.error("API Request Error:", error);
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

  if (response.status === 401) {
    // Lazy import to avoid circular dependency
    const { useAuthStore } = await import("@/hooks/use-auth");
    useAuthStore.getState().logout();
    throw new Error("Your session has expired. Please sign in again.");
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
