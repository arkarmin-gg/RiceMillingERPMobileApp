import { apiFetch } from "@/config/api";
import { CreatePartyInput, Party, PartyResponse, PartyType } from "@/types/party";

export async function getParties(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    get_all?: boolean;
    search?: string;
    type?: PartyType;
  },
): Promise<PartyResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.get_all)
    searchParams.append("get_all", params.get_all.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.type) searchParams.append("type", params.type);

  const queryString = searchParams.toString();
  const url = `/parties${queryString ? `?${queryString}` : ""}`;

  return apiFetch<PartyResponse>(url, {
    authToken: token,
  });
}

export async function getParty(
  token: string,
  id: string,
): Promise<{ data: Party; message: string }> {
  return apiFetch<{ data: Party; message: string }>(`/parties/${id}`, {
    authToken: token,
  });
}

export async function createParty(
  token: string,
  data: CreatePartyInput,
): Promise<{ data: Party; message: string }> {
  return apiFetch<{ data: Party; message: string }>("/parties", {
    method: "POST",
    body: JSON.stringify(data),
    authToken: token,
  });
}

export async function updateParty(
  token: string,
  id: string,
  data: Partial<CreatePartyInput>,
): Promise<{ data: Party; message: string }> {
  return apiFetch<{ data: Party; message: string }>(`/parties/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    authToken: token,
  });
}

export async function deleteParty(
  token: string,
  id: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/parties/${id}`, {
    method: "DELETE",
    authToken: token,
  });
}
