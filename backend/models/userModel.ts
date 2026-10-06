// backend/models/userModel.ts — Consulta cuentas y registra intentos con parámetros.
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { withDatabaseConnection } from '../config/database.js';
import { environment } from '../config/environment.js';
import { HttpError } from '../utils/HttpError.js';
import { isRecord } from '../utils/validation.js';

interface AuthUserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_active: number;
  role: string;
}

interface LastLoginRow extends RowDataPacket {
  last_login_at: string | null;
}

const FIND_USER_SQL = [
  'SELECT users.id, users.name, users.email, users.password_hash, users.is_active,',
  'roles.code AS role FROM users INNER JOIN roles ON roles.id = users.role_id',
  'WHERE users.email = ? LIMIT 1',
].join(' ');

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
): Promise<void> {
  await withDatabaseConnection(async (connection) => {
    try {
      const [result] = await connection.execute<ResultSetHeader>(
        {
          sql: 'INSERT INTO users (role_id, name, email, password_hash) SELECT id, ?, ?, ? FROM roles WHERE code = ?',
          timeout: environment.database.timeoutMs,
        },
        [name, email, passwordHash, 'student'],
      );
      if (result.affectedRows !== 1)
        throw new HttpError(
          500,
          'No se pudo completar la solicitud. Intentá nuevamente.',
        );
    } catch (error) {
      if (isRecord(error) && error.code === 'ER_DUP_ENTRY') {
        throw new HttpError(409, 'Ya existe una cuenta con este email.', {
          email: 'Ya existe una cuenta con este email. Ingresá con tu contraseña.',
        });
      }
      throw error;
    }
  });
}

export async function findUserByEmail(email: string): Promise<AuthUserRow | null> {
  return withDatabaseConnection(async (connection) => {
    const [rows] = await connection.execute<AuthUserRow[]>(
      { sql: FIND_USER_SQL, timeout: environment.database.timeoutMs },
      [email],
    );
    return rows[0] ?? null;
  });
}

export async function recordLoginAttempt(
  userId: number | null,
  attemptedEmail: string,
  success: boolean,
): Promise<string | null> {
  return withDatabaseConnection(async (connection) => {
    await connection.beginTransaction();
    try {
      await connection.execute<ResultSetHeader>(
        {
          sql: 'INSERT INTO login_logs (user_id, attempted_email, success) VALUES (?, ?, ?)',
          timeout: environment.database.timeoutMs,
        },
        [userId, attemptedEmail, success ? 1 : 0],
      );

      let lastLoginAt: string | null = null;
      if (success) {
        const [rows] = await connection.execute<LastLoginRow[]>(
          {
            sql: 'SELECT MAX(attempted_at) AS last_login_at FROM login_logs WHERE user_id = ? AND success = 1',
            timeout: environment.database.timeoutMs,
          },
          [userId],
        );
        const databaseDate = rows[0]?.last_login_at;
        if (!databaseDate) {
          throw new Error('No se pudo obtener la fecha del evento de acceso.');
        }
        lastLoginAt = new Date(databaseDate.replace(' ', 'T') + 'Z').toISOString();
      }
      // Registrar y calcular la fecha se confirman juntos; nunca devolvemos el hash.
      await connection.commit();
      return lastLoginAt;
    } catch (error) {
      // Conservar el error original si también falla la reversión de una conexión caída.
      await connection.rollback().catch(() => undefined);
      throw error;
    }
  });
}
