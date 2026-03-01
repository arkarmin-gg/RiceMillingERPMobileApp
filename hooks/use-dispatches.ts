import {
  createDispatch,
  getDispatchById,
  getDispatches,
  updateDispatch,
} from "@/services/dispatches";
import {
  CreateDispatchRequest,
  DispatchStatus,
  UpdateDispatchRequest,
} from "@/types/dispatch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useDispatches(params?: {
  page?: number;
  limit?: number;
  get_all?: boolean;
  search?: string;
  from_date?: string;
  to_date?: string;
  merchant_id?: string;
  status?: DispatchStatus;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["dispatches", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getDispatches(token, params);
    },
    enabled: !!token,
  });
}

export function useCreateDispatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDispatchRequest) => {
      if (!token) throw new Error("No auth token");
      return createDispatch(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatches"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}

export function useDispatch(id: string) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["dispatch", id],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getDispatchById(token, id);
    },
    enabled: !!token && !!id,
  });
}

export function useUpdateDispatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDispatchRequest) => {
      if (!token) throw new Error("No auth token");
      const { id, ...updateData } = data;
      return updateDispatch(token, id, updateData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["dispatches"] });
      queryClient.invalidateQueries({ queryKey: ["dispatch", id] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}
