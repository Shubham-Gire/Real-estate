export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  timestamp?: string;
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  path?: string;
}
