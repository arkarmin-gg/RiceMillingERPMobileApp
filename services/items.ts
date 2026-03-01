import { apiFetch } from "@/config/api";
import {
  ItemCategory,
  ItemResponse,
  ItemWithStockResponse,
} from "@/types/item";

export async function getItems(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    get_all?: boolean;
    search?: string;
    category?: ItemCategory;
  },
): Promise<ItemResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.get_all)
    searchParams.append("get_all", params.get_all.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.category) searchParams.append("category", params.category);

  const queryString = searchParams.toString();
  const url = `/items${queryString ? `?${queryString}` : ""}`;

  return apiFetch<ItemResponse>(url, {
    authToken: token,
  });
}

export async function getItemsWithStock(
  token: string,
): Promise<ItemWithStockResponse> {
  return apiFetch<ItemWithStockResponse>("/items/with-stock", {
    authToken: token,
  });
}
