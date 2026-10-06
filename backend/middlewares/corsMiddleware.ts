// backend/middlewares/corsMiddleware.ts — Permite solo orígenes web configurados.
import cors from 'cors';

import { environment } from '../config/environment.js';
import { HttpError } from '../utils/HttpError.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Expo Go y clientes HTTP no suelen enviar Origin; CORS no es autenticación.
    if (!origin || environment.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new HttpError(403, 'Origen no permitido.'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Retry-After', 'RateLimit', 'RateLimit-Policy'],
  credentials: false,
});
