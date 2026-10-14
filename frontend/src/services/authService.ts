/**
 * frontend/src/services/authService.ts
 * loginRequest envía email/password a /api/auth/login; registrationRequest envía name/email/password a /api/auth/register.
 * sendAuthRequest realiza POST JSON, aplica timeout/cancelación y valida estado HTTP y estructura de la respuesta.
 */
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

/**
 * Frontera HTTP compartida por login y registro; no accede directamente a MySQL.
 * @param route Acción del backend: login o register.
 * @param body Credenciales que se serializan en el cuerpo JSON, nunca en la URL.
 * @param parseResponse Validador del JSON remoto recibido como unknown.
 * @param expectedStatus Estado exigido: 200 para login, 201 para registro.
 * @param signal Cancelación solicitada por el componente o el contexto.
 * @returns Respuesta de éxito validada; los fallos se convierten en ApiError.
 */
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
    // Esta es la solicitud real del frontend al backend Node.js.
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

/**
 * Solicita POST /api/auth/login con email y contraseña.
 * @returns Usuario público confirmado por el servidor; no devuelve la contraseña.
 * @throws ApiError si la API rechaza las credenciales o falla la comunicación.
 */
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

/**
 * Solicita POST /api/auth/register con nombre, email y contraseña.
 * La confirmación de contraseña es un control local y no forma parte del JSON.
 * @returns Finaliza al recibir 201 y success: true; no inicia sesión automáticamente.
 */
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
