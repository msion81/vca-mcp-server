/**
 * Standardized MCP tool response format per TOOLS_SPEC.
 * Success: { success: true, data: T }
 * Error: { success: false, error: string }
 */

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type ToolResponse<T> = SuccessResponse<T> | ErrorResponse;

export const success = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});

export const error = (message: string): ErrorResponse => ({
  success: false,
  error: message,
});

export const isSuccess = <T>(
  res: ToolResponse<T>
): res is SuccessResponse<T> => res.success === true;

export const isError = <T>(res: ToolResponse<T>): res is ErrorResponse =>
  res.success === false;
