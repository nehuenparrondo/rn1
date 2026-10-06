// src/utils/validation.ts — Replica la política del servidor sin depender de Buffer en el celular.
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD_LENGTH,
} from '@/constants/app';
import { MESSAGES } from '@/constants/messages';
import type { LoginRequest, ValidationErrors } from '@/types/auth';

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
export function getUtf8ByteLength(value: string) {
  let bytes = 0;
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    bytes += codePoint <= 0x7f ? 1 : codePoint <= 0x7ff ? 2 : codePoint <= 0xffff ? 3 : 4;
  }
  return bytes;
}
export function isValidEmail(email: string) {
  const parts = email.split('@');
  const localPart = parts[0];
  const domain = parts[1];
  if (
    email.length > MAX_EMAIL_LENGTH ||
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
export function validateLogin(credentials: LoginRequest): ValidationErrors {
  const email = normalizeEmail(credentials.email);
  const errors: ValidationErrors = {};
  if (!email) errors.email = MESSAGES.emailRequired;
  else if (!isValidEmail(email)) errors.email = MESSAGES.emailInvalid;
  // Los espacios pueden formar parte de una contraseña: no modificar el valor enviado.
  if (!credentials.password.trim()) errors.password = MESSAGES.passwordRequired;
  else if (Array.from(credentials.password).length < MIN_PASSWORD_LENGTH)
    errors.password = MESSAGES.passwordShort;
  else if (getUtf8ByteLength(credentials.password) > MAX_PASSWORD_BYTES)
    errors.password = MESSAGES.passwordLong;
  return errors;
}
