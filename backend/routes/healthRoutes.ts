// backend/routes/healthRoutes.ts — Mantiene el estado del servidor fuera del login.
import { Router } from 'express';

import { health } from '../controllers/healthController.js';

export const healthRoutes = Router();
healthRoutes.get('/health', health);
