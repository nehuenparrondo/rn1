-- backend/database/create_app_user.sql — Crea una cuenta SQL local con permisos mínimos.
-- Antes de ejecutar, definir @APP_PASSWORD en ESTA MISMA sesión SQL.
-- La contraseña debe tener al menos 24 caracteres y no ser un placeholder.
-- La copia privada con SET @APP_PASSWORD se guarda como *.local.sql, ignorado por Git.
-- Ejecutar como administrador DESPUÉS de schema.sql. La API nunca ejecuta este script.

USE np_user_access;

DROP PROCEDURE IF EXISTS provisionAppUser;

DELIMITER $$

CREATE PROCEDURE provisionAppUser()
SQL SECURITY INVOKER
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @APP_PASSWORD = NULL;
    SET @CREATE_APP_USER_SQL = NULL;
    RESIGNAL;
  END;

  IF @APP_PASSWORD IS NULL
    OR CHAR_LENGTH(@APP_PASSWORD) < 24
    OR @APP_PASSWORD = 'REEMPLAZAR_POR_PASSWORD_LOCAL'
    OR @APP_PASSWORD = 'REPLACE_WITH_A_LOCAL_PASSWORD'
    OR @APP_PASSWORD = 'PEGAR_AQUI_LA_CONTRASEÑA_PRIVADA_GENERADA'
  THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Defini una contraseña privada de al menos 24 caracteres.';
  END IF;

  SET @CREATE_APP_USER_SQL = CONCAT(
    'CREATE USER ''np_login_app''@''127.0.0.1'' IDENTIFIED BY ',
    QUOTE(@APP_PASSWORD)
  );
  PREPARE createAppUserStatement FROM @CREATE_APP_USER_SQL;
  EXECUTE createAppUserStatement;
  DEALLOCATE PREPARE createAppUserStatement;

  GRANT SELECT (id, role_id, name, email, password_hash, is_active, created_at)
    ON np_user_access.users TO 'np_login_app'@'127.0.0.1';
  GRANT SELECT (id, code, name)
    ON np_user_access.roles TO 'np_login_app'@'127.0.0.1';
  GRANT SELECT (user_id, success, attempted_at)
    ON np_user_access.login_logs TO 'np_login_app'@'127.0.0.1';
  GRANT INSERT (user_id, attempted_email, success, attempted_at)
    ON np_user_access.login_logs TO 'np_login_app'@'127.0.0.1';

  SET @APP_PASSWORD = NULL;
  SET @CREATE_APP_USER_SQL = NULL;
END$$

DELIMITER ;

CALL provisionAppUser();
DROP PROCEDURE provisionAppUser;

-- Sin privilegios de INSERT en users, UPDATE, DELETE, DROP, ALTER ni GRANT OPTION.
-- No usar IF NOT EXISTS en CREATE USER: una cuenta preexistente debe revisarse.
