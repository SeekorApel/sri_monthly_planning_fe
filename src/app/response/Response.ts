export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  error: string | null;
  message: string;
  path: string;
  data: T;
}
