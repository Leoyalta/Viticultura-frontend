export interface Client {
  _id: string;
  name: string;
  secondName: string;
  phone: string;
}

export interface Product {
  _id: string;
  code: string;
  variety: string;
  pie: string;
}

export interface Order {
  _id: string;
  client: Client | null;
  product: Product | null;
  quantity: number;
  plantingRequested: boolean;
  plantingDate?: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface OrdersQueryParams {
  page?: number;
  per_page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  client?: string;
  product?: string;
  plantingRequested?: boolean;
  plantingDate?: string | null;
  status?: string;
}

export interface OrdersResponse {
  page: number;
  per_page: number;
  totalOrders: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  orders: Order[];
}

export interface CreateOrderPayload {
  clientId: string;
  productId: string;
  quantity: number;
  plantingRequested: boolean;
  plantingDate?: string | null;
  status: string;
  notes?: string;
}

export interface UpdateOrderResponse {
  status: number;
  message: string;
  data: Order;
}
export interface SingleOrderResponse {
  status: number;
  message: string;
  order: Order;
}
