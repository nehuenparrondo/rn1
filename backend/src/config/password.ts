/**
 * backend/src/config/password.ts
 * Genera un hash bcrypt ficticio para comparar también cuando no existe el email y evitar una salida inmediata distinta.
 */
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';

import { environment } from './environment.js';

export const DUMMY_PASSWORD_HASH = await bcrypt.hash(
  randomBytes(32).toString('hex'),
  environment.bcryptRounds,
);
