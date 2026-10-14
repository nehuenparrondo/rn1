/**
 * frontend/src/utils/responseGuards.ts
 * Trata el JSON remoto como unknown y devuelve contratos tipados o null. Solo copia campos públicos permitidos.
 */
import type {
  LoginResponse,
  RegistrationResponse,
  User,
  ValidationErrors,
} from '@/types/auth';
import { isValidEmail } from './validation';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** Valida identidad pública y fecha ISO; excluye cualquier campo adicional del JSON. */
export function parseUser(value: unknown): User | null {
  if (
    !isRecord(value) ||
    typeof value.id !== 'number' ||
    !Number.isSafeInteger(value.id) ||
    value.id <= 0 ||
    typeof value.name !== 'string' ||
    !value.name.trim() ||
    value.name.length > 100 ||
    typeof value.email !== 'string' ||
    !isValidEmail(value.email) ||
    typeof value.role !== 'string' ||
    !/^[a-z][a-z0-9_]{0,49}$/.test(value.role) ||
    typeof value.lastLoginAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.lastLoginAt) ||
    !Number.isFinite(Date.parse(value.lastLoginAt)) ||
    new Date(value.lastLoginAt).toISOString() !== value.lastLoginAt
  )
    return null;
  return {
    id: value.id,
    name: value.name,
    email: value.email,
    role: value.role,
    lastLoginAt: value.lastLoginAt,
  };
}
/** Acepta éxito con usuario válido o error con mensajes por campo; si no, devuelve null. */
export function parseLoginResponse(value: unknown): LoginResponse | null {
  if (
    !isRecord(value) ||
    typeof value.message !== 'string' ||
    !value.message.trim() ||
    value.message.length > 300
  )
    return null;
  if (value.success === true) {
    const user = parseUser(value.user);
    return user ? { success: true, message: value.message, user } : null;
  }
  if (value.success !== false) return null;
  const errors: ValidationErrors = {};
  if (value.errors !== undefined) {
    if (!isRecord(value.errors)) return null;
    for (const field of ['name', 'email', 'password', 'confirmPassword'] as const) {
      const message = value.errors[field];
      if (message !== undefined) {
        if (typeof message !== 'string' || !message.trim() || message.length > 300)
          return null;
        errors[field] = message;
      }
    }
  }
  return {
    success: false,
    message: value.message,
    ...(Object.keys(errors).length > 0 ? { errors } : {}),
  };
}

/** Valida la confirmación del alta sin exigir usuario: registrarse no equivale a ingresar. */
export function parseRegistrationResponse(value: unknown): RegistrationResponse | null {
  if (
    !isRecord(value) ||
    typeof value.message !== 'string' ||
    !value.message.trim() ||
    value.message.length > 300
  )
    return null;
  if (value.success === true) return { success: true, message: value.message };
  const result = parseLoginResponse(value);
  return result && !result.success ? result : null;
}
