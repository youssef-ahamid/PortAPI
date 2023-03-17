import { z } from 'zod';
import { PortAPIResponse } from './PortAPIResponse';
import { Method, createPortAPIRequest } from './PortAPIRequest';

export type IPortAPI = {
  [fn in Lowercase<Method>]: <T>(
    path: string,
    body: any,
    schema?: z.ZodSchema<T>
  ) => Promise<PortAPIResponse<T>>;
};

export function createClient(
  baseURL: string,
  headers?: Record<string, string>
) {
  return {
    post: <T>(path: string, body: any, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest('POST', `${baseURL}${path}`, schema, body, headers),
    get: <T>(path: string, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest(
        'GET',
        `${baseURL}${path}`,
        schema,
        undefined,
        headers
      ),
    patch: <T>(path: string, body: any, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest('PATCH', `${baseURL}${path}`, schema, body, headers),
    put: <T>(path: string, body: any, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest('PUT', `${baseURL}${path}`, schema, body, headers),
    delete: <T>(path: string, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest(
        'DELETE',
        `${baseURL}${path}`,
        schema,
        undefined,
        headers
      ),
    head: <T>(path: string, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest(
        'HEAD',
        `${baseURL}${path}`,
        schema,
        undefined,
        headers
      ),
    options: <T>(path: string, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest(
        'OPTIONS',
        `${baseURL}${path}`,
        schema,
        undefined,
        headers
      ),
    trace: <T>(path: string, schema?: z.ZodSchema<T>) =>
      createPortAPIRequest(
        'TRACE',
        `${baseURL}${path}`,
        schema,
        undefined,
        headers
      )
  };
}
