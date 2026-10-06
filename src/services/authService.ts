// src/services/authService.ts — POST con cancelación, timeout y validación del JSON recibido.
import { API_TIMEOUT_MS } from '@/constants/app';
import { MESSAGES } from '@/constants/messages';
import type { LoginRequest, User } from '@/types/auth';
import { ApiError } from '@/utils/ApiError';
import { parseLoginResponse } from '@/utils/responseGuards';
import { normalizeEmail } from '@/utils/validation';
import { getApiUrl } from './apiConfig';

export async function loginRequest(
  credentials: LoginRequest,
  signal?: AbortSignal,
): Promise<User> {
  const baseUrl = getApiUrl();
  const controller = new AbortController();
  let timedOut = false;
  const cancel = () => controller.abort();
  if (signal?.aborted) throw new ApiError('cancelled', MESSAGES.cancelled);
  signal?.addEventListener('abort', cancel);
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_TIMEOUT_MS);
  try {
    const response = await fetch(baseUrl + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      signal: controller.signal,
      body: JSON.stringify({
        email: normalizeEmail(credentials.email),
        password: credentials.password,
      }),
    });
    if (
      !response.headers.get('content-type')?.toLowerCase().includes('application/json')
    ) {
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      if (controller.signal.aborted)
        throw new ApiError(
          timedOut ? 'timeout' : 'cancelled',
          timedOut ? MESSAGES.timeout : MESSAGES.cancelled,
        );
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    const result = parseLoginResponse(body);
    if (!result || (response.ok && !result.success) || (!response.ok && result.success)) {
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    if (!result.success) {
      // Nunca mostrar libremente un mensaje remoto inesperado, en especial errores SQL.
      const message =
        response.status === 401
          ? MESSAGES.credentials
          : response.status === 429
            ? MESSAGES.rateLimit
            : response.status === 400
              ? 'Revisá los datos del formulario.'
              : MESSAGES.server;
      const retryHeader = response.headers.get('retry-after');
      const retryAfterSeconds =
        retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) : undefined;
      throw new ApiError(
        'http',
        message,
        response.status,
        response.status === 400 ? result.errors : undefined,
        retryAfterSeconds,
      );
    }
    return result.user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) {
      throw new ApiError(
        timedOut ? 'timeout' : 'cancelled',
        timedOut ? MESSAGES.timeout : MESSAGES.cancelled,
      );
    }
    throw new ApiError('network', MESSAGES.network);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}
