import { Pagination } from "./type";

export type ProductionBatchStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ProductionBatchOutput {
  id: string;
  batch_id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  bags: number;
  loose_lb: number;
}

export interface ProductionBatch {
  id: string;
  batch_number: string;
  merchant_id: string;
  merchant_name: string;
  production_date: string;
  status: ProductionBatchStatus;
  total_quantity: number;
  total_bags: number;
  total_loose_lb: number;
  outputs: ProductionBatchOutput[];
}

export interface ProductionBatchResponse {
  data: ProductionBatch[];
  pagination: Pagination;
  message: string;
}

export interface CreateProductionBatchRequest {
  merchant_id: string;
  production_date: string;
  status: ProductionBatchStatus;
  outputs: {
    item_id: string;
    bags: number;
    loose_lb: number;
  }[];
}

export interface UpdateProductionBatchRequest {
  id: string;
  merchant_id?: string;
  production_date?: string;
  status?: ProductionBatchStatus;
  outputs?: {
    id?: string;
    item_id: string;
    bags: number;
    loose_lb: number;
  }[];
}
