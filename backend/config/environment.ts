// backend/config/environment.ts — Valida configuración sin mostrar valores secretos.
import 'dotenv/config';
import { X509Certificate } from 'node:crypto';

function readInteger(
  name: string,
  defaultValue: number,
  minimum: number,
  maximum: number,
) {
  const rawValue = process.env[name] ?? String(defaultValue);
  const value = Number(rawValue);

  if (
    !/^\d+$/.test(rawValue) ||
    !Number.isInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(name + ' debe ser un entero dentro del rango permitido.');
  }

  return value;
}

function readText(name: string, defaultValue: string) {
  const value = (process.env[name] ?? defaultValue).trim();
  if (!value) {
    throw new Error(name + ' no puede estar vacío.');
  }
  return value;
}

function readDatabaseSsl() {
  const enabled = process.env.DB_SSL ?? 'false';
  if (!['true', 'false'].includes(enabled))
    throw new Error('DB_SSL debe ser true o false.');
  if (enabled === 'false') return undefined;
  const ca = (process.env.DB_SSL_CA ?? '').replace(/\\n/g, '\n').trim();
  try {
    if (!new X509Certificate(ca).ca) throw new Error();
  } catch {
    throw new Error('Configurá DB_SSL_CA con el certificado CA PEM del proveedor.');
  }
  return { ca, rejectUnauthorized: true, verifyIdentity: true };
}

const databaseUser = readText('DB_USER', 'np_login_app');
if (databaseUser.toLowerCase() === 'root') {
  throw new Error('DB_USER debe ser una cuenta de aplicación, nunca root.');
}

const databaseName = readText('DB_NAME', 'np_user_access');
if (!/^[a-zA-Z][a-zA-Z0-9_]{0,63}$/.test(databaseName)) {
  throw new Error('DB_NAME debe ser un identificador válido.');
}

const databasePassword = process.env.DB_PASSWORD;
const passwordPlaceholders = [
  'REEMPLAZAR_POR_PASSWORD_LOCAL',
  'REPLACE_WITH_A_LOCAL_PASSWORD',
  'PEGAR_AQUI_LA_CONTRASEÑA_PRIVADA_GENERADA',
];
if (
  !databasePassword ||
  databasePassword.length < 24 ||
  passwordPlaceholders.includes(databasePassword)
) {
  throw new Error('Configurá DB_PASSWORD con la contraseña privada de la cuenta SQL.');
}

const corsOrigins = readText(
  'CORS_ORIGINS',
  'http://localhost:8083,http://127.0.0.1:8083',
)
  .split(',')
  .map((origin) => origin.trim());

for (const origin of corsOrigins) {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error('CORS_ORIGINS debe contener orígenes HTTP/HTTPS válidos.');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.origin !== origin ||
    url.username ||
    url.password
  ) {
    throw new Error(
      'CORS_ORIGINS debe usar orígenes exactos, sin rutas ni credenciales.',
    );
  }
}

export const environment = {
  host: readText('HOST', '0.0.0.0'),
  port: readInteger('PORT', 3000, 1, 65535),
  corsOrigins,
  trustProxyHops: readInteger('TRUST_PROXY_HOPS', 0, 0, 1),
  database: {
    host: readText('DB_HOST', '127.0.0.1'),
    port: readInteger('DB_PORT', 3306, 1, 65535),
    name: databaseName,
    user: databaseUser,
    password: databasePassword,
    timeoutMs: readInteger('DB_TIMEOUT_MS', 5000, 1000, 30000),
    ssl: readDatabaseSsl(),
  },
  loginRateLimit: {
    windowMs: readInteger('LOGIN_RATE_LIMIT_WINDOW_MS', 900000, 1000, 3600000),
    maximum: readInteger('LOGIN_RATE_LIMIT_MAX', 10, 1, 1000),
  },
  registrationRateLimit: {
    windowMs: readInteger('REGISTER_RATE_LIMIT_WINDOW_MS', 900000, 1000, 3600000),
    maximum: readInteger('REGISTER_RATE_LIMIT_MAX', 5, 1, 100),
  },
  bcryptRounds: readInteger('BCRYPT_ROUNDS', 12, 10, 14),
};
