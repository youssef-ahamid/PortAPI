import fetch from 'cross-fetch';
import { z } from 'zod';
import { createPortAPIError } from './PortAPIError';
import { PortAPIResponse, createPortAPIResponse } from './PortAPIResponse';
import { EventHandlers } from './PortAPIRequestHandler';

export const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
  'TRACE'
] as const;
export type Method = (typeof methods)[number];

export async function createPortAPIRequest<T>(
  method: Method,
  url: string,
  schema?: z.ZodSchema<T>,
  body?: any,
  headers: Record<string, string> = {},
  handlers?: EventHandlers
) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });

  if (response.status === 401) {
    handlers?.onFailedAuthentication?.();
    return createPortAPIResponse(
      false,
      createPortAPIError('UNAUTHENTICATED', response.status)
    );
  }

  if (response.status === 403) {
    handlers?.onFailedAuthorization?.();
    return createPortAPIResponse(
      false,
      createPortAPIError('UNAUTHENTICATED', response.status)
    );
  }

  if (!response.ok) {
    handlers?.onFailedRequest?.(response);
    return createPortAPIResponse(
      false,
      createPortAPIError('INVALID_RESPONSE', response.status)
    );
  }

  const json = (await response.json().catch(() => {
    handlers?.onFailedParse?.();
    return createPortAPIResponse(
      false,
      createPortAPIError('INVALID_RESPONSE_JSON', response.status)
    );
  })) as T;

  if (schema) {
    const validationResult = schema.safeParse(json);
    if (!validationResult.success) {
      handlers?.onFailedValidation?.(validationResult.error.errors);
      return createPortAPIResponse(
        false,
        createPortAPIError(
          'INVALID_RESPONSE_JSON',
          response.status,
          validationResult.error.message,
          validationResult.error
        )
      );
    }
    handlers?.onSuccess?.(validationResult.data);
    return createPortAPIResponse(true, validationResult.data);
  }

  handlers?.onSuccess?.(json);
  return createPortAPIResponse(true, json);
}

export type PortAPIRequest<T> = (
  method: string,
  url: string,
  schema?: z.ZodSchema<T>,
  body?: any,
  headers?: Record<string, string>
) => Promise<PortAPIResponse<T>>;
