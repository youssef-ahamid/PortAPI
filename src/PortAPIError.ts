export const portAPIErrors = [
  'INVALID_URL',
  'INVALID_METHOD',
  'INVALID_BODY',
  'INVALID_HEADERS',
  'UNAUTHENTICATED',
  'UNAUTHORIZED',
  'INVALID_RESPONSE',
  'INVALID_STATUS_CODE',
  'INVALID_STATUS_TEXT',
  'INVALID_RESPONSE_JSON',
  'INVALID_RESPONSE_TEXT',
  'INVALID_RESPONSE_BODY',
  'INVALID_RESPONSE_HEADERS',
  'INVALID_RESPONSE_STATUS_CODE'
] as const;

export type PortAPIErrorCode = (typeof portAPIErrors)[number];

export class PortAPIError {
  constructor(
    public type: PortAPIErrorCode,
    public statusCode: number,
    public message?: string,
    public error?: object
  ) {}

  toString() {
    return `${this.type} ${this.statusCode} ${this.message}`;
  }

  toJSON() {
    return {
      type: this.type,
      statusCode: this.statusCode,
      message: this.message,
      error: this.error
    };
  }
}

export const createPortAPIError = (
  type: PortAPIErrorCode,
  statusCode: number,
  message?: string,
  error?: object
) => new PortAPIError(type, statusCode, message, error);
