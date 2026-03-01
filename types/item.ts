import { Pagination } from "./type";

export type ItemCategory =
  | "PADDY"
  | "RICE"
  | "BROKEN"
  | "POINT_BROKEN"
  | "BRAN"
  | "POINT_BRAN"
  | "HUSK"
  | "WASTED";

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  unit: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ItemResponse {
  data: Item[];
  pagination: Pagination;
  message: string;
}
