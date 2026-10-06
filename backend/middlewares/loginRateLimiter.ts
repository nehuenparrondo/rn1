// backend/middlewares/loginRateLimiter.ts — Limita todos los POST al login por IP real.
import { rateLimit } from 'express-rate-limit';

import { environment } from '../config/environment.js';
import { LOGIN_RATE_LIMIT_MESSAGE } from '../constants/auth.js';
import type { ErrorResponse } from '../types/auth.js';

export const loginRateLimiter = rateLimit({
  windowMs: environment.loginRateLimit.windowMs,
  limit: environment.loginRateLimit.maximum,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  // La app no confía en proxies: headers reenviados arbitrarios no cambian la IP.
  validate: { xForwardedForHeader: false },
  handler(_request, response) {
    response.status(429).json({
      success: false,
      message: LOGIN_RATE_LIMIT_MESSAGE,
    } satisfies ErrorResponse);
  },
});
