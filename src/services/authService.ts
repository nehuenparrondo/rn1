// src/services/authService.ts — POST con cancelación, timeout y validación del JSON recibido.
import { API_TIMEOUT_MS } from '@/constants/app';
import { MESSAGES } from '@/constants/messages';
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  User,
} from '@/types/auth';
import { ApiError } from '@/utils/ApiError';
import { parseLoginResponse, parseRegistrationResponse } from '@/utils/responseGuards';
import { normalizeEmail } from '@/utils/validation';
import { getApiUrl } from './apiConfig';

async function sendAuthRequest<Success extends { success: true; message: string }>(
  route: 'login' | 'register',
  body: LoginRequest | RegistrationRequest,
  parseResponse: (
    value: unknown,
  ) => Success | Extract<LoginResponse, { success: false }> | null,
  expectedStatus: number,
  signal?: AbortSignal,
): Promise<Success> {
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
    const response = await fetch(baseUrl + '/api/auth/' + route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    if (
      !response.headers.get('content-type')?.toLowerCase().includes('application/json')
    ) {
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      if (controller.signal.aborted)
        throw new ApiError(
          timedOut ? 'timeout' : 'cancelled',
          timedOut ? MESSAGES.timeout : MESSAGES.cancelled,
        );
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    const result = parseResponse(responseBody);
    if (
      !result ||
      (response.ok && (!result.success || response.status !== expectedStatus)) ||
      (!response.ok && result.success)
    ) {
      throw new ApiError('response', MESSAGES.invalidResponse, response.status);
    }
    if (!result.success) {
      // Nunca mostrar libremente un mensaje remoto inesperado, en especial errores SQL.
      const message =
        response.status === 401
          ? MESSAGES.credentials
          : response.status === 429
            ? MESSAGES.rateLimit
            : response.status === 409 && route === 'register'
              ? MESSAGES.emailTaken
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
        response.status === 400
          ? result.errors
          : response.status === 409 && route === 'register'
            ? { email: MESSAGES.emailTaken }
            : undefined,
        retryAfterSeconds,
      );
    }
    return result;
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

export async function loginRequest(
  credentials: LoginRequest,
  signal?: AbortSignal,
): Promise<User> {
  const result = await sendAuthRequest(
    'login',
    { email: normalizeEmail(credentials.email), password: credentials.password },
    parseLoginResponse,
    200,
    signal,
  );
  return result.user;
}

export async function registrationRequest(
  credentials: RegistrationRequest,
  signal?: AbortSignal,
): Promise<void> {
  await sendAuthRequest(
    'register',
    {
      name: credentials.name.trim(),
      email: normalizeEmail(credentials.email),
      password: credentials.password,
    },
    parseRegistrationResponse,
    201,
    signal,
  );
}
