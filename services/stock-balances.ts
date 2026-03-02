import { apiFetch } from "@/config/api";
import { StockBalanceResponse } from "@/types/stock-balance";

export async function getStockBalances(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    owner_id?: string;
    item_id?: string;
    item_category?: string;
    search?: string;
  },
): Promise<StockBalanceResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.owner_id) searchParams.append("owner_id", params.owner_id);
  if (params?.item_id) searchParams.append("item_id", params.item_id);
  if (params?.item_category)
    searchParams.append("item_category", params.item_category);
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = `/stock-balances${queryString ? `?${queryString}` : ""}`;

  return apiFetch<StockBalanceResponse>(url, {
    authToken: token,
  });
}
