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

export interface DispatchableItem {
  item_id: string;
  item_name: string;
  quantity: number;
  bags: number;
  loose_lb: number;
}

export interface DispatchableParty {
  id: string;
  full_name: string;
  phone: string;
  type: PartyType;
  dispatchable_items: DispatchableItem[];
}

export interface DispatchablePartiesResponse {
  data: DispatchableParty[];
  message: string;
}
