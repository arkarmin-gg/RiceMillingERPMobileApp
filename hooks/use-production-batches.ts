import {
  createProductionBatch,
  getProductionBatchById,
  getProductionBatches,
  updateProductionBatch,
} from "@/services/production-batches";
import {
  CreateProductionBatchRequest,
  ProductionBatchStatus,
  UpdateProductionBatchRequest,
} from "@/types/production-batch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useProductionBatches(params?: {
  page?: number;
  limit?: number;
  get_all?: boolean;
  search?: string;
  status?: ProductionBatchStatus;
  from_date?: string;
  to_date?: string;
  merchant_id?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["production-batches", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getProductionBatches(token, params);
    },
    enabled: !!token,
  });
}

export function useCreateProductionBatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductionBatchRequest) => {
      if (!token) throw new Error("No auth token");
      return createProductionBatch(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-batches"] });
    },
  });
}

export function useProductionBatch(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["production-batch", id],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getProductionBatchById(token, id);
    },
    enabled: !!token && !!id,
  });
}

export function useUpdateProductionBatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductionBatchRequest) => {
      if (!token) throw new Error("No auth token");
      const { id, ...updateData } = data;
      return updateProductionBatch(token, id, updateData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["production-batches"] });
      queryClient.invalidateQueries({ queryKey: ["production-batch", id] });
    },
  });
}
