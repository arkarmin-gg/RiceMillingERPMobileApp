import { getStockBalances } from "@/services/stock-balances";
import { ItemCategory } from "@/types/type";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useStockBalances(params?: {
  page?: number;
  limit?: number;
  owner_id?: string;
  item_id?: string;
  item_category?: ItemCategory;
  search?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["stock-balances", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getStockBalances(token, params);
    },
    enabled: !!token,
  });
}
