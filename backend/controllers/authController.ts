// backend/controllers/authController.ts — Compara credenciales y devuelve solo datos públicos.
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';

import { DUMMY_PASSWORD_HASH } from '../config/password.js';
import {
  INTERNAL_ERROR_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
} from '../constants/auth.js';
import { findUserByEmail, recordLoginAttempt } from '../models/userModel.js';
import type { AuthLocals, LoginResponse } from '../types/auth.js';
import { HttpError } from '../utils/HttpError.js';

export const login: RequestHandler<
  Record<string, string>,
  LoginResponse,
  unknown,
  Record<string, unknown>,
  AuthLocals
> = async (_request, response) => {
  const credentials = response.locals.loginRequest;
  if (!credentials) {
    throw new HttpError(500, INTERNAL_ERROR_MESSAGE);
  }
  const user = await findUserByEmail(credentials.email);
  // También comparar si el email no existe o está inactivo, sin un retorno rápido.
  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user?.password_hash ?? DUMMY_PASSWORD_HASH,
  );
  const success = user !== null && user.is_active === 1 && passwordMatches;
  const lastLoginAt = await recordLoginAttempt(
    user?.id ?? null,
    credentials.email,
    success,
  );
  if (!success || !user) {
    response.status(401).json({
      success: false,
      message: INVALID_CREDENTIALS_MESSAGE,
    });
    return;
  }
  if (!lastLoginAt) {
    throw new HttpError(500, INTERNAL_ERROR_MESSAGE);
  }
  response.status(200).json({
    success: true,
    message: 'Ingreso correcto.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLoginAt,
    },
  });
};
