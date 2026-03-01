import { apiFetch } from "@/config/api";
import {
  ProductionBatchResponse,
  ProductionBatchStatus,
} from "@/types/production-batch";

export async function getProductionBatches(
  token: string,
  params?: {
    page?: number;
    limit?: number;
    get_all?: boolean;
    search?: string;
    status?: ProductionBatchStatus;
    from_date?: string;
    to_date?: string;
    merchant_id?: string;
  },
): Promise<ProductionBatchResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.get_all)
    searchParams.append("get_all", params.get_all.toString());
  if (params?.search) searchParams.append("search", params.search);
  if (params?.status) searchParams.append("status", params.status);
  if (params?.from_date) searchParams.append("from_date", params.from_date);
  if (params?.to_date) searchParams.append("to_date", params.to_date);
  if (params?.merchant_id)
    searchParams.append("merchant_id", params.merchant_id);

  const queryString = searchParams.toString();
  const url = `/production-batches${queryString ? `?${queryString}` : ""}`;

  return apiFetch<ProductionBatchResponse>(url, {
    authToken: token,
  });
}

export async function createProductionBatch(
  token: string,
  data: import("@/types/production-batch").CreateProductionBatchRequest,
): Promise<import("@/types/production-batch").ProductionBatch> {
  return apiFetch<import("@/types/production-batch").ProductionBatch>(
    "/production-batches",
    {
      method: "POST",
      body: JSON.stringify(data),
      authToken: token,
    },
  );
}

export async function getProductionBatchById(
  token: string,
  id: string,
): Promise<{ data: import("@/types/production-batch").ProductionBatch }> {
  return apiFetch<{ data: import("@/types/production-batch").ProductionBatch }>(
    `/production-batches/${id}`,
    {
      authToken: token,
    },
  );
}

export async function updateProductionBatch(
  token: string,
  id: string,
  data: Partial<
    import("@/types/production-batch").CreateProductionBatchRequest
  >,
): Promise<import("@/types/production-batch").ProductionBatch> {
  return apiFetch<import("@/types/production-batch").ProductionBatch>(
    `/production-batches/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      authToken: token,
    },
  );
}
