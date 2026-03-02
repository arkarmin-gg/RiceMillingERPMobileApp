export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export type ItemCategory =
  | "PADDY"
  | "RICE"
  | "BROKEN"
  | "POINT_BROKEN"
  | "BRAN"
  | "POINT_BRAN"
  | "HUSK"
  | "WASTED";
