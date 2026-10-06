// backend/constants/auth.ts — Centraliza límites y evita mensajes que enumeren cuentas.
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72;
export const MAX_EMAIL_LENGTH = 254;
export const JSON_BODY_LIMIT = '4kb';
export const INVALID_CREDENTIALS_MESSAGE = 'Credenciales incorrectas';
export const INTERNAL_ERROR_MESSAGE =
  'No se pudo completar la solicitud. Intentá nuevamente.';
export const LOGIN_RATE_LIMIT_MESSAGE =
  'Demasiados intentos. Esperá un momento y volvé a intentar.';
