/**
 * backend/src/controllers/authController.ts
 * register cifra la contraseña y crea una cuenta student. login busca el email, compara bcrypt y registra el intento.
 * Devuelve JSON público: 201 para alta, 200 para ingreso correcto o 401 genérico para credenciales rechazadas.
 */
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';

import { DUMMY_PASSWORD_HASH } from '../config/password.js';
import { environment } from '../config/environment.js';
import {
  INTERNAL_ERROR_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
} from '../constants/auth.js';
import { createUser, findUserByEmail, recordLoginAttempt } from '../models/userModel.js';
import type { AuthLocals, LoginResponse, RegistrationResponse } from '../types/auth.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Recibe datos ya validados en response.locals.registrationRequest.
 * Calcula bcrypt en el servidor, crea el usuario y responde 201 sin datos privados.
 * Los errores SQL o de email duplicado se delegan al manejador central.
 */
export const register: RequestHandler<
  Record<string, string>,
  RegistrationResponse,
  unknown,
  Record<string, unknown>,
  AuthLocals
> = async (_request, response) => {
  const credentials = response.locals.registrationRequest;
  if (!credentials) throw new HttpError(500, INTERNAL_ERROR_MESSAGE);
  const passwordHash = await bcrypt.hash(credentials.password, environment.bcryptRounds);
  await createUser(credentials.name, credentials.email, passwordHash);
  response.status(201).json({
    success: true,
    message: 'Cuenta creada. Ya podés ingresar.',
  });
};

/**
 * Verifica existencia, estado activo y contraseña de la cuenta solicitada.
 * Registra el resultado y responde 200 con usuario público o 401 genérico.
 * Este ejercicio no emite tokens ni crea una sesión persistente de servidor.
 */
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
