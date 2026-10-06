// Limita solicitudes de registro antes de validar o calcular hashes bcrypt.
import { rateLimit } from 'express-rate-limit';
import { environment } from '../config/environment.js';
import type { ErrorResponse } from '../types/auth.js';

export const registrationRateLimiter = rateLimit({
  windowMs: environment.registrationRateLimit.windowMs,
  limit: environment.registrationRateLimit.maximum,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  handler(_request, response) {
    response.status(429).json({
      success: false,
      message: 'Demasiados intentos de registro. Esperá y volvé a intentar.',
    } satisfies ErrorResponse);
  },
});
