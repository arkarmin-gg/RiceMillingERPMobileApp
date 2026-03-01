import { getItems } from "@/services/items";
import { ItemCategory } from "@/types/item";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useItems(params?: {
  page?: number;
  limit?: number;
  get_all?: boolean;
  search?: string;
  category?: ItemCategory;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getItems(token, params);
    },
    enabled: !!token,
  });
}
