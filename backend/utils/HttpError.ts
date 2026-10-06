// backend/utils/HttpError.ts — Representa errores públicos sin mezclar detalles internos.
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
