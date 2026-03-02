import { apiFetch } from "@/config/api";
import { UserResponse } from "@/types/user";

export async function getUsers(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    get_all?: boolean;
    search?: string;
  },
): Promise<UserResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.get_all)
    searchParams.append("get_all", params.get_all.toString());
  if (params?.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = `/users${queryString ? `?${queryString}` : ""}`;

  return apiFetch<UserResponse>(url, {
    authToken: token,
  });
}
