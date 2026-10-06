// backend/middlewares/validateLogin.ts — Acepta únicamente email/password en un objeto JSON.
import type { RequestHandler } from 'express';

import type { AuthLocals, LoginResponse } from '../types/auth.js';
import { HttpError } from '../utils/HttpError.js';
import { isRecord, validateLoginData } from '../utils/validation.js';

export const requireJsonBody: RequestHandler = (request, _response, next) => {
  if (!request.is('application/json')) {
    next(new HttpError(415, 'Enviá los datos con Content-Type: application/json.'));
    return;
  }
  next();
};

export const validateLogin: RequestHandler<
  Record<string, string>,
  LoginResponse,
  unknown,
  Record<string, unknown>,
  AuthLocals
> = (request, response, next) => {
  if (Object.keys(request.query).length > 0) {
    next(
      new HttpError(400, 'Enviá los datos solamente en el cuerpo JSON, no en la URL.'),
    );
    return;
  }
  if (
    !isRecord(request.body) ||
    Object.keys(request.body).some((key) => !['email', 'password'].includes(key))
  ) {
    next(new HttpError(400, 'El cuerpo debe ser un objeto con email y password.'));
    return;
  }
  const { data, errors } = validateLoginData(request.body);
  if (Object.keys(errors).length > 0) {
    next(new HttpError(400, 'Revisá los datos del formulario.', errors));
    return;
  }
  response.locals.loginRequest = data;
  next();
};
