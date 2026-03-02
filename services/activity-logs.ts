import { apiFetch } from "@/config/api";
import {
  ActivityLogResponse,
  SingleActivityLogResponse,
} from "@/types/activity-log";

export async function getActivityLogs(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    action?: string;
    subject_type?: string;
    subject_id?: string;
    user_id?: string;
    from_date?: string;
    to_date?: string;
  },
): Promise<ActivityLogResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.action) searchParams.append("action", params.action);
  if (params?.subject_type)
    searchParams.append("subject_type", params.subject_type);
  if (params?.subject_id) searchParams.append("subject_id", params.subject_id);
  if (params?.user_id) searchParams.append("user_id", params.user_id);
  if (params?.from_date) searchParams.append("from_date", params.from_date);
  if (params?.to_date) searchParams.append("to_date", params.to_date);

  const queryString = searchParams.toString();
  const url = `/activity-logs${queryString ? `?${queryString}` : ""}`;

  return apiFetch<ActivityLogResponse>(url, {
    authToken: token,
  });
}

export async function getActivityLogById(
  token: string,
  id: string,
): Promise<SingleActivityLogResponse> {
  return apiFetch<SingleActivityLogResponse>(`/activity-logs/${id}`, {
    authToken: token,
  });
}
