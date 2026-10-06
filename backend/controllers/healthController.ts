// backend/controllers/healthController.ts — Comprueba HTTP y conexión SQL por separado.
import type { RequestHandler } from 'express';
import { withDatabaseConnection } from '../config/database.js';
import { environment } from '../config/environment.js';

export const health: RequestHandler = (_request, response) => {
  response.status(200).json({ success: true, message: 'Servidor disponible.' });
};

export const ready: RequestHandler = async (_request, response) => {
  try {
    await withDatabaseConnection(async (connection) => {
      await connection.execute({
        sql: 'SELECT 1',
        timeout: environment.database.timeoutMs,
      });
    });
    response.status(200).json({ success: true, message: 'Servidor y base disponibles.' });
  } catch {
    response.status(503).json({ success: false, message: 'La base no está disponible.' });
  }
};
