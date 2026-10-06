// src/utils/ApiError.ts — Errores tipados sin propagar texto interno del servidor.
import type { ValidationErrors } from '@/types/auth';

export type ApiErrorKind =
  'http' | 'network' | 'timeout' | 'cancelled' | 'configuration' | 'response' | 'busy';
export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    message: string,
    public readonly status?: number,
    public readonly errors?: ValidationErrors,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
