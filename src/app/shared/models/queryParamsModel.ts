export interface QueryParams {
  page?: number;
  per_page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  variety?: string;
  pie?: string;
  code?: string;
  isAvailable?: boolean;
}
