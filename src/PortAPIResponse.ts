import { PortAPIError } from './PortAPIError';

export type PortAPISuccessResponse<T> = {
  success: true;
  data: T;
};

export type PortAPIErrorResponse = {
  success: false;
  error: PortAPIError;
};

type Data<T = any> = T extends PortAPIError ? never : T;

export function createPortAPIResponse<T, R extends boolean>(
  success: R,
  data: R extends true ? T : PortAPIError
): PortAPIResponse<T, R> {
  if (success) {
    return {
      success: true,
      data: data as Data<T>
    } as PortAPIResponse<T, R>;
  }

  return {
    success: false,
    error: data
  } as unknown as PortAPIResponse<T, R>;
}

export type PortAPIResponse<T, R extends boolean = true> = R extends true
  ? PortAPISuccessResponse<T>
  : R extends false
  ? PortAPIErrorResponse
  : PortAPISuccessResponse<T> | PortAPIErrorResponse;
