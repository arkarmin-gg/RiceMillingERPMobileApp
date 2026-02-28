import {
  createParty,
  deleteParty,
  getParties,
  getParty,
  updateParty,
} from "@/services/parties";
import { CreatePartyInput, PartyType, UpdatePartyInput } from "@/types/party";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useParties(params?: {
  page?: number;
  limit?: number;
  get_all?: boolean;
  search?: string;
  type?: PartyType;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["parties", params],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getParties(token, params);
    },
    enabled: !!token,
  });
}

export function useParty(id: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["party", id],
    queryFn: () => {
      if (!token) throw new Error("No auth token");
      return getParty(token, id);
    },
    enabled: !!token && !!id,
  });
}

export function useCreateParty() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartyInput) => {
      if (!token) throw new Error("No auth token");
      return createParty(token, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}

export function useUpdateParty() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartyInput) => {
      if (!token) throw new Error("No auth token");
      const { id, ...updateData } = data;
      return updateParty(token, id, updateData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["party", id] });
    },
  });
}

export function useDeleteParty() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("No auth token");
      return deleteParty(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
    },
  });
}
