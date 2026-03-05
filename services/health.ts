import { apiFetch } from "@/config/api";

export interface HealthResponse {
  status: string;
  message: string;
  database: string;
  timestamp: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health", {
    timeout: 5000, // Short timeout for health check
  });
}
