/**
 * backend/src/utils/HttpError.ts
 * Transporta estado HTTP, mensaje público y errores de campo hasta errorHandler; no incluye detalles de SQL.
 */
import type { ValidationErrors } from '../types/auth.js';

export class HttpError extends Error {
  readonly status: number;
  readonly errors?: ValidationErrors;

  constructor(status: number, message: string, errors?: ValidationErrors) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.errors = errors;
  }
}
