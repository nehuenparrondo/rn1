// Valida el registro sin permitir que el cliente elija permisos o estado de cuenta.
import type { RequestHandler } from 'express';
import type { AuthLocals, RegistrationResponse } from '../types/auth.js';
import { HttpError } from '../utils/HttpError.js';
import { isRecord, validateRegistrationData } from '../utils/validation.js';

export const validateRegistration: RequestHandler<
  Record<string, string>,
  RegistrationResponse,
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
    Object.keys(request.body).some((key) => !['name', 'email', 'password'].includes(key))
  ) {
    next(
      new HttpError(400, 'El cuerpo debe contener solamente nombre, email y contraseña.'),
    );
    return;
  }
  const { data, errors } = validateRegistrationData(request.body);
  if (Object.keys(errors).length > 0) {
    next(new HttpError(400, 'Revisá los datos del formulario.', errors));
    return;
  }
  response.locals.registrationRequest = data;
  next();
};
