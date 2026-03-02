import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useUsers(params?: {
  page?: number;
  limit?: number;
  get_all?: boolean;
  search?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getUsers(token, params);
    },
    enabled: !!token,
  });
}
