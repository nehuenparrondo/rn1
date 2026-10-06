// backend/routes/authRoutes.ts — Ordena límite, JSON, validación y controlador.
import { Router, json } from 'express';

import { JSON_BODY_LIMIT } from '../constants/auth.js';
import { login } from '../controllers/authController.js';
import { loginRateLimiter } from '../middlewares/loginRateLimiter.js';
import { requireJsonBody, validateLogin } from '../middlewares/validateLogin.js';
import type { ErrorResponse } from '../types/auth.js';

export const authRoutes = Router();

authRoutes.post(
  '/login',
  loginRateLimiter,
  requireJsonBody,
  json({ limit: JSON_BODY_LIMIT, strict: true }),
  validateLogin,
  login,
);

authRoutes.all('/login', (_request, response) => {
  response.setHeader('Allow', 'POST, OPTIONS');
  response.status(405).json({
    success: false,
    message: 'Usá POST con un cuerpo JSON para ingresar.',
  } satisfies ErrorResponse);
});
