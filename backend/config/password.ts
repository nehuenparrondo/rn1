// backend/config/password.ts — Evita omitir el coste bcrypt cuando un email no existe.
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';

import { environment } from './environment.js';

export const DUMMY_PASSWORD_HASH = await bcrypt.hash(
  randomBytes(32).toString('hex'),
  environment.bcryptRounds,
);
