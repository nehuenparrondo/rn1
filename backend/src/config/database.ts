/**
 * backend/src/config/database.ts
 * Crea el pool MySQL con la cuenta limitada del backend. withDatabaseConnection fija UTC y libera la conexión incluso si falla.
 * Los secretos se leen del entorno del servidor y nunca se importan desde React Native.
 */
import mysql, { type PoolConnection } from 'mysql2/promise';

import { environment } from './environment.js';

export const databasePool = mysql.createPool({
  host: environment.database.host,
  port: environment.database.port,
  database: environment.database.name,
  user: environment.database.user,
  password: environment.database.password,
  charset: 'utf8mb4',
  timezone: 'Z',
  dateStrings: true,
  supportBigNumbers: true,
  bigNumberStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20,
  connectTimeout: environment.database.timeoutMs,
  multipleStatements: false,
  ssl: environment.database.ssl,
});

/**
 * Presta una conexión del pool a una operación asíncrona y devuelve su resultado.
 * Fija UTC para los DATETIME y garantiza release mediante finally.
 */
export async function withDatabaseConnection<Result>(
  operation: (connection: PoolConnection) => Promise<Result>,
): Promise<Result> {
  const connection = await databasePool.getConnection();
  try {
    // DATETIME no incluye zona: fijarla también en el servidor, no solo en mysql2.
    await connection.query({
      sql: "SET time_zone = '+00:00'",
      timeout: environment.database.timeoutMs,
    });
    return await operation(connection);
  } finally {
    connection.release();
  }
}
