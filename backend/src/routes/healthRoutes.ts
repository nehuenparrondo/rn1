/**
 * backend/src/routes/healthRoutes.ts
 * Define GET /health y GET /ready bajo /api; no comparte el flujo de credenciales del login.
 */
import { Router } from 'express';

import { health, ready } from '../controllers/healthController.js';

export const healthRoutes = Router();
healthRoutes.get('/health', health);
healthRoutes.get('/ready', ready);
