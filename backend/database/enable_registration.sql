-- Amplía solo el permiso de registro en una instalación local ya provisionada.
-- Ejecutar una vez como administrador; no cambia datos ni contraseñas.
GRANT INSERT (role_id, name, email, password_hash)
  ON np_user_access.users TO 'np_login_app'@'127.0.0.1';
