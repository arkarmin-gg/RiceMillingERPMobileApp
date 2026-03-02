import { getActivityLogById, getActivityLogs } from "@/services/activity-logs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useActivityLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  subject_type?: string;
  subject_id?: string;
  user_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getActivityLogs(token, params);
    },
    enabled: !!token,
  });
}

export function useActivityLog(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["activity-log", id],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getActivityLogById(token, id);
    },
    enabled: !!token && !!id,
  });
}
