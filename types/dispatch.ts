import { Pagination } from "./type";

export type DispatchStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface DispatchItem {
  id: string;
  dispatch_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  bags: number;
  loose_lb: number;
}

export interface Dispatch {
  id: string;
  dispatch_number: string;
  merchant_id: string;
  merchant_name: string;
  dispatch_date: string;
  description: string;
  status?: DispatchStatus;
  total_quantity: number;
  total_bags: number;
  total_loose_lb: number;
  items: DispatchItem[];
}

export interface DispatchResponse {
  data: Dispatch[];
  pagination: Pagination;
  message: string;
}

export interface CreateDispatchRequest {
  merchant_id: string;
  dispatch_date: string;
  description: string;
  status?: DispatchStatus;
  items: {
    item_id: string;
    bags: number;
    loose_lb: number;
  }[];
}

export interface UpdateDispatchRequest {
  id: string;
  merchant_id?: string;
  dispatch_date?: string;
  description?: string;
  status?: DispatchStatus;
  items?: {
    id?: string;
    item_id: string;
    bags: number;
    loose_lb: number;
  }[];
}
