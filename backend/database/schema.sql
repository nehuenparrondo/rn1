-- backend/database/schema.sql — Crea el modelo relacional de acceso en 3FN.
-- Importar una sola vez como administrador; no borra ni reemplaza tablas existentes.
-- Compatible con MariaDB 10.4+ y MySQL 8.0.16+ con CHECK habilitado.

CREATE DATABASE IF NOT EXISTS np_user_access
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE np_user_access;
SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  CONSTRAINT pk_roles PRIMARY KEY (id),
  CONSTRAINT uq_roles_code UNIQUE (code),
  CONSTRAINT ck_roles_code_not_blank CHECK (CHAR_LENGTH(TRIM(code)) > 0),
  CONSTRAINT ck_roles_name_not_blank CHECK (CHAR_LENGTH(TRIM(name)) > 0)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_id INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash CHAR(60) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email),
  INDEX idx_users_role_id (role_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id)
    REFERENCES roles (id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT ck_users_name_not_blank CHECK (CHAR_LENGTH(TRIM(name)) > 0),
  CONSTRAINT ck_users_email_basic CHECK (
    LOCATE('@', email) > 1 AND LOCATE('@', email) < CHAR_LENGTH(email)
  ),
  CONSTRAINT ck_users_password_hash CHECK (
    CHAR_LENGTH(password_hash) = 60
    AND LEFT(password_hash, 4) IN ('$2a$', '$2b$')
  ),
  CONSTRAINT ck_users_is_active CHECK (is_active IN (0, 1))
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE login_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NULL,
  attempted_email VARCHAR(254) NOT NULL,
  success TINYINT NOT NULL,
  attempted_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT pk_login_logs PRIMARY KEY (id),
  INDEX idx_login_logs_user_success_date (user_id, success, attempted_at),
  INDEX idx_login_logs_attempted_at (attempted_at),
  CONSTRAINT fk_login_logs_user FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT ck_login_logs_email_not_blank CHECK (
    CHAR_LENGTH(TRIM(attempted_email)) > 0
  ),
  CONSTRAINT ck_login_logs_success CHECK (success IN (0, 1)),
  CONSTRAINT ck_login_logs_known_success CHECK (success = 0 OR user_id IS NOT NULL)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- El último acceso se calcula con MAX(attempted_at) de los eventos exitosos.
-- No se guardan contraseñas, hashes ni direcciones IP en el historial.
