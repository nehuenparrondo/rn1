// backend/routes/authRoutes.ts — Ordena límite, JSON, validación y controlador.
import { Router, json } from 'express';

import { JSON_BODY_LIMIT } from '../constants/auth.js';
import { login, register } from '../controllers/authController.js';
import { loginRateLimiter } from '../middlewares/loginRateLimiter.js';
import { registrationRateLimiter } from '../middlewares/registrationRateLimiter.js';
import { validateRegistration } from '../middlewares/validateRegistration.js';
import { requireJsonBody, validateLogin } from '../middlewares/validateLogin.js';
import type { ErrorResponse } from '../types/auth.js';

export const authRoutes = Router();

authRoutes.post(
  '/register',
  registrationRateLimiter,
  requireJsonBody,
  json({ limit: JSON_BODY_LIMIT, strict: true }),
  validateRegistration,
  register,
);

authRoutes.all('/register', (_request, response) => {
  response.setHeader('Allow', 'POST, OPTIONS');
  response.status(405).json({
    success: false,
    message: 'Usá POST con un cuerpo JSON para crear una cuenta.',
  } satisfies ErrorResponse);
});

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
