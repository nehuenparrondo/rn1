// backend/app.ts — Compone Express sin iniciar puertos ni depender de la interfaz.
import express from 'express';
import helmet from 'helmet';

import { corsMiddleware } from './middlewares/corsMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRoutes } from './routes/authRoutes.js';
import { healthRoutes } from './routes/healthRoutes.js';
import type { ErrorResponse } from './types/auth.js';

export const app = express();
app.disable('x-powered-by');
app.set('trust proxy', false);
app.use(helmet());
app.use('/api', (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(corsMiddleware);
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: 'Ruta no encontrada.',
  } satisfies ErrorResponse);
});
app.use(errorHandler);
