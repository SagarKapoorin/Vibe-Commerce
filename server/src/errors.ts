export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
export const badRequest = (message = 'Bad Request', details?: unknown) =>
  new HttpError(400, message, details);
export const unauthorized = (message = 'Unauthorized', details?: unknown) =>
  new HttpError(401, message, details);
export const notFound = (message = 'Not Found', details?: unknown) =>
  new HttpError(404, message, details);
export const conflict = (message = 'Conflict', details?: unknown) =>
  new HttpError(409, message, details);
export const internal = (message = 'Internal Server Error', details?: unknown) =>
  new HttpError(500, message, details);
