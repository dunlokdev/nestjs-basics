export interface ApiResponse<T = unknown> {
  author?: string;
  statusCode: number;
  message: string;
  data: {
    result: T;
    meta?: Record<string, any>;
  };
}
