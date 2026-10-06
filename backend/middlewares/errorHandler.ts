// backend/middlewares/errorHandler.ts — Convierte errores en JSON sin exponer SQL ni secretos.
import type { ErrorRequestHandler } from 'express';

import { INTERNAL_ERROR_MESSAGE } from '../constants/auth.js';
import type { ErrorResponse } from '../types/auth.js';
import { HttpError } from '../utils/HttpError.js';
import { isRecord } from '../utils/validation.js';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  if (error instanceof HttpError) {
    const body: ErrorResponse = { success: false, message: error.message };
    if (error.errors) {
      body.errors = error.errors;
    }
    response.status(error.status).json(body);
    return;
  }
  if (isRecord(error)) {
    if (error.type === 'entity.parse.failed') {
      response.status(400).json({
        success: false,
        message: 'El JSON es inválido o no contiene un objeto.',
      } satisfies ErrorResponse);
      return;
    }
    if (error.type === 'entity.too.large') {
      response.status(413).json({
        success: false,
        message: 'El cuerpo de la solicitud es demasiado grande.',
      } satisfies ErrorResponse);
      return;
    }
    if (error.type === 'charset.unsupported' || error.type === 'encoding.unsupported') {
      response.status(415).json({
        success: false,
        message: 'El formato de la solicitud no está soportado.',
      } satisfies ErrorResponse);
      return;
    }
  }
  // No registrar el objeto error: mysql2 puede incluir consultas y datos privados.
  console.error(
    'Error interno de la API. Revisá la conexión y configuración del servidor.',
  );
  response.status(500).json({
    success: false,
    message: INTERNAL_ERROR_MESSAGE,
  } satisfies ErrorResponse);
};
