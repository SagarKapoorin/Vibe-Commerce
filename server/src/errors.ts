export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export class HttpError extends Error {
  status: number;
  details?: JsonValue;
  constructor(status: number, message: string, details?: JsonValue) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
export const badRequest = (message = 'Bad Request', details?: JsonValue) =>
  new HttpError(400, message, details);
export const unauthorized = (message = 'Unauthorized', details?: JsonValue) =>
  new HttpError(401, message, details);
export const notFound = (message = 'Not Found', details?: JsonValue) =>
  new HttpError(404, message, details);
export const conflict = (message = 'Conflict', details?: JsonValue) =>
  new HttpError(409, message, details);
export const internal = (message = 'Internal Server Error', details?: JsonValue) =>
  new HttpError(500, message, details);
