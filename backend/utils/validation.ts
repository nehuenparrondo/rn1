// backend/utils/validation.ts — Valida datos desconocidos sin confiar en el frontend.
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD_LENGTH,
} from '../constants/auth.js';
import type { LoginRequest, ValidationErrors } from '../types/auth.js';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidEmail(email: string) {
  const parts = email.split('@');
  const localPart = parts[0];
  const domain = parts[1];
  if (
    parts.length !== 2 ||
    !localPart ||
    !domain ||
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_{}|~\x60-]+$/.test(localPart)
  ) {
    return false;
  }
  const labels = domain.split('.');
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length >= 1 &&
        label.length <= 63 &&
        /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label),
    )
  );
}

export function validateLoginData(body: Record<string, unknown>): {
  data: LoginRequest;
  errors: ValidationErrors;
} {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  // La contraseña no se recorta ni se transforma: los espacios pueden ser legítimos.
  const password = typeof body.password === 'string' ? body.password : '';
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Ingresá tu email.';
  } else if (email.length > MAX_EMAIL_LENGTH || !isValidEmail(email)) {
    errors.email = 'Ingresá un email válido de hasta 254 caracteres.';
  }

  if (!password.trim()) {
    errors.password = 'Ingresá tu contraseña.';
  } else if (Array.from(password).length < MIN_PASSWORD_LENGTH) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  } else if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    errors.password = 'La contraseña no puede superar 72 bytes en UTF-8.';
  }

  return { data: { email, password }, errors };
}
