-- backend/database/queries.sql — Consultas didácticas de lectura para el administrador.
-- No devuelve hashes ni modifica usuarios o eventos.

USE np_user_access;
SET time_zone = '+00:00';

-- Relacionar usuarios con su rol sin copiar el nombre del rol a users.
SELECT
  users.id,
  users.name,
  users.email,
  roles.code AS role,
  roles.name AS role_name,
  users.is_active
FROM users
INNER JOIN roles ON roles.id = users.role_id
ORDER BY users.id;

-- Contar cuentas por rol, incluyendo roles que todavía no tienen usuarios.
SELECT
  roles.code,
  roles.name,
  COUNT(users.id) AS total_users
FROM roles
LEFT JOIN users ON users.role_id = roles.id
GROUP BY roles.id, roles.code, roles.name
ORDER BY roles.code;

-- Calcular el último acceso exitoso: NULL significa que aún no ingresó.
SELECT
  users.id,
  users.name,
  users.email,
  MAX(login_logs.attempted_at) AS last_login_at
FROM users
LEFT JOIN login_logs
  ON login_logs.user_id = users.id AND login_logs.success = 1
GROUP BY users.id, users.name, users.email
ORDER BY users.id;

-- Ver intentos de los últimos siete días; los emails desconocidos no tienen user_id.
SELECT
  login_logs.id,
  login_logs.attempted_email,
  users.name AS matched_user_name,
  login_logs.success,
  login_logs.attempted_at
FROM login_logs
LEFT JOIN users ON users.id = login_logs.user_id
WHERE login_logs.attempted_at >= UTC_TIMESTAMP() - INTERVAL 7 DAY
ORDER BY login_logs.attempted_at DESC, login_logs.id DESC
LIMIT 100;

-- Contar resultados por día, útil para interpretar el registro de intentos.
SELECT
  DATE(attempted_at) AS login_date,
  COUNT(*) AS total_attempts,
  SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successful_attempts,
  SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed_attempts
FROM login_logs
WHERE attempted_at >= UTC_TIMESTAMP() - INTERVAL 30 DAY
GROUP BY DATE(attempted_at)
ORDER BY login_date DESC;

-- Ejemplo parametrizado equivalente al que empleará mysql2.execute en la Parte 3.
SET @LOGIN_EMAIL = 'student@np.test';
PREPARE findPublicUser FROM
  'SELECT users.id, users.name, users.email, roles.code AS role
   FROM users INNER JOIN roles ON roles.id = users.role_id
   WHERE users.email = ? AND users.is_active = 1 LIMIT 1';
EXECUTE findPublicUser USING @LOGIN_EMAIL;
DEALLOCATE PREPARE findPublicUser;
SET @LOGIN_EMAIL = NULL;
