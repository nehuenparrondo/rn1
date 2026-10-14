/**
 * frontend/src/services/apiConfig.ts
 * Valida una URL HTTP/HTTPS de origen, sin rutas, consultas ni credenciales. Solo lee EXPO_PUBLIC_API_URL.
 */
import { MESSAGES } from '@/constants/messages';
import { ApiError } from '@/utils/ApiError';

/** Devuelve el origen normalizado o lanza ApiError ante una URL ausente o insegura. */
export function validateApiUrl(value: string | undefined) {
  try {
    if (!value) throw new Error();
    const url = new URL(value.trim());
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    )
      throw new Error();
    return url.origin;
  } catch {
    throw new ApiError('configuration', MESSAGES.configuration);
  }
}
export function getApiUrl() {
  // Expo requiere acceso directo a process.env.EXPO_PUBLIC_* para sustituirlo en el bundle.
  return validateApiUrl(process.env.EXPO_PUBLIC_API_URL);
}
