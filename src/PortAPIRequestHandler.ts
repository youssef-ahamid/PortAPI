import { z } from 'zod';
import { RequestOptions } from './PortAPIRequest';

export const events = [
  'onSuccess',
  'onFailedValidation',
  'onFailedRequest',
  'onFailedParse',
  'onFailedAuthorization',
  'onFailedAuthentication',
  'beforeRequest',
  'onRequest'
] as const;

export type EventName = (typeof events)[number];

export type EventHandlers = {
  onSuccess: (data: any) => any;
  onFailedValidation: (error: z.ZodIssue[]) => any;
  onFailedRequest: (error: any) => any;
  onFailedParse: () => any;
  onFailedAuthorization: () => any;
  onFailedAuthentication: () => any;
  onRequest: (request: RequestOptions) => Partial<RequestOptions> | void;
  beforeRequest: (request: RequestOptions) => any;
};
