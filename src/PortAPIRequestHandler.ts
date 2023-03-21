import { z } from 'zod';

export const events = [
  'onSuccess',
  'onFailedValidation',
  'onFailedRequest',
  'onFailedParse',
  'onFailedAuthorization',
  'onFailedAuthentication'
] as const;

export type EventName = (typeof events)[number];

export type OnSuccess = (data: any) => any;
export type OnFailedValidation = (error: z.ZodIssue[]) => any;
export type OnFailedRequest = (error: any) => any;
export type OnFailedParse = () => any;
export type OnFailedAuthorization = () => any;
export type OnFailedAuthentication = () => any;

export type EventHandlers = {
  onSuccess?: OnSuccess;
  onFailedValidation?: OnFailedValidation;
  onFailedRequest?: OnFailedRequest;
  onFailedParse?: OnFailedParse;
  onFailedAuthorization?: OnFailedAuthorization;
  onFailedAuthentication?: OnFailedAuthentication;
};
