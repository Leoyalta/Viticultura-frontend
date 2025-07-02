export interface Client {
  _id: string;
  name: string;
  secondName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientsResponse {
  clients: Client[];
  page: number;
  per_page: number;
  totalClients: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
