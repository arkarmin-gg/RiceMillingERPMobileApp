import { Pagination } from "./type";

export type PartyType = "MERCHANT" | "FARMER" | "BROKER" | "CUSTOMER";

export interface Party {
  id: string;
  full_name: string;
  type: PartyType;
  phone: string;
  address: string;
  nrc: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PartyResponse {
  data: Party[];
  pagination: Pagination;
  message: string;
}

export interface CreatePartyInput {
  full_name: string;
  type: PartyType;
  phone: string;
  address: string;
  nrc: string;
}

export interface UpdatePartyInput extends Partial<CreatePartyInput> {
  id: string;
}
