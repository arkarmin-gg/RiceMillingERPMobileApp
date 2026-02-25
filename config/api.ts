// const API_BASE_URL = "http://192.168.1.3:8000/api/v1";
// const API_BASE_URL = "http://192.168.0.205:8000/api/v1";
const API_BASE_URL = "http://localhost:8000/api/v1";

type ApiFetchOptions = RequestInit & {
  authToken?: string | null;
};

async function apiFetch<TResponse = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const { authToken, headers, body, ...rest } = options;

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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    body,
    headers: mergedHeaders,
  });

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
