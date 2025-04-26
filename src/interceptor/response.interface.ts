export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: {
    result: T;
    meta?: Record<string, any>;
  };
}
