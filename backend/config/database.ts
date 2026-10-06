// backend/config/database.ts — Usa un pool limitado con la cuenta SQL de menor privilegio.
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
