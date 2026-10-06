-- backend/database/seed.sql — Carga cuentas ficticias con hashes bcrypt de coste 12.
-- Solo desarrollo académico: no utilizar estas credenciales públicas en producción.
-- No reimportar sobre cuentas existentes; no elimina ni restablece contraseñas.

USE np_user_access;
SET NAMES utf8mb4;
SET time_zone = '+00:00';

START TRANSACTION;

INSERT INTO roles (id, code, name) VALUES
  (1, 'admin', 'Administrador'),
  (2, 'student', 'Estudiante');

INSERT INTO users (id, role_id, name, email, password_hash, is_active) VALUES
  (
    1,
    1,
    'Administrador Demo',
    'admin@np.test',
    '$2b$12$BIqs2RTCpdE/Hy5ljJs.4O.nAZFBQ1QwlKMfCz.3S5JGfF1jAm6Hu',
    1
  ),
  (
    2,
    2,
    'Estudiante Demo',
    'student@np.test',
    '$2b$12$Uc7O9VZiJDZ8ZArZds1hY.gWZ8ZXCy/K1rsBlgiK4MGU90zRP9.VG',
    1
  ),
  (
    3,
    2,
    'Usuario Inactivo Demo',
    'inactive@np.test',
    '$2b$12$zL9oK8MsemBcN0AZjsAITuBWnqC3ejEZEEs4ahAEVKtkUamul6wDS',
    0
  );

COMMIT;

-- login_logs comienza vacío: no se inventan accesos que nunca ocurrieron.
