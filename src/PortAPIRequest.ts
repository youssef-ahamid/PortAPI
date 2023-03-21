import fetch from 'cross-fetch';
import { z } from 'zod';
import { createPortAPIError } from './PortAPIError';
import { PortAPIResponse, createPortAPIResponse } from './PortAPIResponse';

export const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'] as const;
export type Method = typeof methods[number];

export async function createPortAPIRequest<T>(
  method: Method,
  url: string,
  schema?: z.ZodSchema<T>,
  body?: any,
  headers: Record<string, string> = {}
) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });

  const json = (await response.json()) as T;

  if (schema) {
    const validationResult = schema.safeParse(json);
    if (!validationResult.success)
      return createPortAPIResponse(
        false,
        createPortAPIError(
          'INVALID_RESPONSE_JSON',
          response.status,
          validationResult.error.message,
          validationResult.error
        )
      );
    return createPortAPIResponse(true, validationResult.data);
  }

  return createPortAPIResponse(true, json);
}

export type PortAPIRequest<T> = (
  method: string,
  url: string,
  schema?: z.ZodSchema<T>,
  body?: any,
  headers?: Record<string, string>
) => Promise<PortAPIResponse<T>>;
