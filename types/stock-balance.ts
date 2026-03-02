import { Pagination } from "./type";

export interface StockBalance {
  owner_id: string;
  owner_name: string;
  item_id: string;
  item_name: string;
  item_category: string;
  unit: string;
  quantity: number;
  bags: number;
  loose_lb: number;
}

export interface StockBalanceResponse {
  data: StockBalance[];
  pagination: Pagination;
  message: string;
}
