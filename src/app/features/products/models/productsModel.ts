export interface Product {
  _id: string;
  code: string;
  variety: string;
  pie: string;
  clon: string;
  clonPie: string;
  total: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface ProductsResponse {
  page: number;
  per_page: number;
  products: Product[];
  totalProducts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  variety?: string;
  pie?: string;
  code?: string;
  isAvailable?: boolean;
}
