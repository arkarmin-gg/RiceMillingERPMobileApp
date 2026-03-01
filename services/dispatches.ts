import { apiFetch } from "@/config/api";
import {
  CreateDispatchRequest,
  Dispatch,
  DispatchResponse,
  UpdateDispatchRequest,
} from "@/types/dispatch";

export async function getDispatches(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    get_all?: boolean;
    search?: string;
    from_date?: string;
    to_date?: string;
    merchant_id?: string;
    status?: string;
  },
): Promise<DispatchResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.get_all)
    searchParams.append("get_all", params.get_all.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.from_date) searchParams.append("from_date", params.from_date);
  if (params?.to_date) searchParams.append("to_date", params.to_date);
  if (params?.merchant_id)
    searchParams.append("merchant_id", params.merchant_id);
  if (params?.status) searchParams.append("status", params.status);

  const queryString = searchParams.toString();
  const url = `/dispatches${queryString ? `?${queryString}` : ""}`;

  return apiFetch<DispatchResponse>(url, {
    authToken: token,
  });
}

export async function createDispatch(
  token: string,
  data: CreateDispatchRequest,
): Promise<Dispatch> {
  return apiFetch<Dispatch>("/dispatches", {
    method: "POST",
    body: JSON.stringify(data),
    authToken: token,
  });
}

export async function getDispatchById(
  token: string,
  id: string,
): Promise<{ data: Dispatch }> {
  return apiFetch<{ data: Dispatch }>(`/dispatches/${id}`, {
    authToken: token,
  });
}

export async function updateDispatch(
  token: string,
  id: string,
  data: Omit<UpdateDispatchRequest, "id">,
): Promise<Dispatch> {
  return apiFetch<Dispatch>(`/dispatches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    authToken: token,
  });
}
