// backend/server.ts — Inicia la API y libera el pool al cerrar el proceso.
import { app } from './app.js';
import { databasePool } from './config/database.js';
import { environment } from './config/environment.js';

const server = app.listen(environment.port, environment.host, () => {
  console.info('API de acceso iniciada en el puerto %d.', environment.port);
});

server.requestTimeout = 15000;
server.headersTimeout = 10000;
let shuttingDown = false;

function shutdownServer() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  const forcedShutdown = setTimeout(() => process.exit(1), 10000);
  forcedShutdown.unref();
  server.close(async (error) => {
    try {
      await databasePool.end();
      process.exitCode = error ? 1 : 0;
    } catch {
      process.exitCode = 1;
    } finally {
      clearTimeout(forcedShutdown);
    }
  });
  server.closeIdleConnections();
}

server.once('error', () => {
  console.error('No se pudo iniciar el servidor. Revisá si el puerto está ocupado.');
  void databasePool.end().catch(() => undefined);
  process.exitCode = 1;
});

process.once('SIGINT', shutdownServer);
process.once('SIGTERM', shutdownServer);
