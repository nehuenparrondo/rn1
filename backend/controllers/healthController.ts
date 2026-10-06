// backend/controllers/healthController.ts — Comprueba el servidor HTTP, no la base.
import type { RequestHandler } from 'express';

export const health: RequestHandler = (_request, response) => {
  response.status(200).json({ success: true, message: 'Servidor disponible.' });
};
