import { z } from 'zod';
import { PortAPIResponse } from './PortAPIResponse';
import { Method, createPortAPIRequest, methods } from './PortAPIRequest';

export type IPortAPI = {
  [fn in Lowercase<Method>]:
    | (<T>(
        path: string,
        schema?: z.ZodSchema<T>,
        body?: object
      ) => Promise<PortAPIResponse<T>>)
    | (<T>(
        path: string,
        schema?: z.ZodSchema<T>
      ) => Promise<PortAPIResponse<T>>);
};

export function createClient(
  baseURL: string,
  headers?: Record<string, string>
) {
  const object: Partial<IPortAPI> = {};

  methods.forEach((method) => {
    if (method === 'POST' || method === 'PUT' || method === 'PATCH')
      object[method.toLowerCase() as Lowercase<Method>] = <T>(
        path: string,
        schema?: z.ZodSchema<T>,
        body?: object
      ) =>
        createPortAPIRequest(
          method,
          `${baseURL}${path}`,
          schema,
          body,
          headers
        ) as Promise<PortAPIResponse<T>>;
    else
      object[method.toLowerCase() as Lowercase<Method>] = <T>(
        path: string,
        schema?: z.ZodSchema<T>
      ) =>
        createPortAPIRequest(
          method,
          `${baseURL}${path}`,
          schema,
          undefined,
          headers
        ) as Promise<PortAPIResponse<T>>;
  });

  return object as IPortAPI;
}
