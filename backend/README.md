# Backend · API Node.js + Express + MySQL

Aplicación independiente del frontend, ejecutada con **Node.js >=24**.
Su código TypeScript vive exclusivamente en `src/`. No utiliza React Native
ni importa código del cliente. Se comunica con la interfaz mediante HTTP/JSON.

## Instalar y ejecutar

Desde **esta carpeta**:

```powershell
npm.cmd ci
npm.cmd run dev
```

`dev` ejecuta `tsx watch src/server.ts`. El proceso carga `backend/.env`
y utiliza MySQL/MariaDB de XAMPP con una cuenta limitada.
En esta PC la base y el entorno ya existen: **no reimportar los SQL**.

## Configuración privada

Para otra computadora, crear `.env` a partir de `.env.example` solo si no existe.
Sus valores pertenecen al servidor:

- `HOST` y `PORT`: interfaz y puerto HTTP (3000 por defecto).
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: conexión SQL.
- `CORS_ORIGINS`: lista de orígenes web exactos, separados por comas.
- Límites de solicitudes, coste bcrypt, timeout SQL y TLS: ver la plantilla.

Nunca usar root como usuario de la API. `src/config/environment.ts` valida
el entorno y rechaza configuraciones inseguras o incompletas.
Mantener el directorio de trabajo en `backend/` al iniciar para cargar su .env.
No colocar este archivo en frontend ni publicarlo en GitHub.

## Arquitectura

| Carpeta/archivo    | Responsabilidad                                               |
| ------------------ | ------------------------------------------------------------- |
| `src/server.ts`    | Abre HTTP y cierra servidor/pool al finalizar.                |
| `src/app.ts`       | Compone Express, cabeceras, CORS, rutas y errores.            |
| `src/routes/`      | Define métodos y URLs; ordena los middlewares.                |
| `src/middlewares/` | Límites por IP, formato JSON, validación y manejo de errores. |
| `src/controllers/` | Ejecuta cada caso de uso y produce la respuesta JSON.         |
| `src/models/`      | Consultas SQL parametrizadas y transacciones.                 |
| `src/config/`      | Entorno, pool MySQL y hash ficticio bcrypt.                   |
| `src/constants/`   | Límites y mensajes compartidos del servidor.                  |
| `src/types/`       | Contratos internos y JSON públicos, sin importar al frontend. |
| `src/utils/`       | Validación y errores públicos tipados.                        |
| `database/`        | Schema, seed y permisos; scripts administrativos manuales.    |
| `examples/`        | JSON de ejemplo para probar el login.                         |

## Contrato HTTP

Todas las rutas de credenciales requieren `Content-Type: application/json`.
La URL no debe contener credenciales ni parámetros de formulario.

| Método y ruta             | Entrada                     | Éxito                              |
| ------------------------- | --------------------------- | ---------------------------------- |
| `POST /api/auth/login`    | `email`, `password`         | 200: `success`, `message`, `user`. |
| `POST /api/auth/register` | `name`, `email`, `password` | 201: `success`, `message`.         |
| `GET /api/health`         | Sin cuerpo                  | 200 si HTTP responde.              |
| `GET /api/ready`          | Sin cuerpo                  | 200 si SQL responde; 503 si no.    |

Ejemplo del JSON público de login (datos ficticios, fecha ilustrativa):

```json
{
  "success": true,
  "message": "Ingreso correcto.",
  "user": {
    "id": 1,
    "name": "Usuario de ejemplo",
    "email": "student@np.test",
    "role": "student",
    "lastLoginAt": "2026-10-14T12:00:00.000Z"
  }
}
```

Los errores usan `{ "success": false, "message": "..." }` y, cuando corresponde,
`errors` por campo. Estados: 400 datos/JSON inválidos, 401 credenciales rechazadas,
405 método incorrecto, 409 email duplicado, 413 cuerpo excesivo, 415 formato no
aceptado, 429 límite de solicitudes, 500 fallo interno y 503 SQL no disponible.

El login busca por email mediante parámetros `?`, compara bcrypt y verifica
`is_active`. Registra el intento en `login_logs` y solo devuelve datos públicos.
Un email inexistente y una contraseña incorrecta producen el mismo rechazo.
El registro calcula bcrypt en el servidor; el rol siempre es student.

## Base y seguridad

`np_user_access` contiene `roles`, `users` y `login_logs`.
Solo el backend usa mysql2 y las credenciales SQL. El teléfono nunca se conecta
directamente al puerto de MySQL.

Los hashes no se devuelven por JSON. CORS no sustituye autenticación.
Los límites por IP usan memoria del proceso y no son un contador distribuido.
Este ejercicio **no emite JWT ni mantiene sesiones persistentes**; no debe
presentarse como autorización completa de recursos privados.

Los SQL existentes conservan sus permisos y datos. Ver
[documentación de base de datos](../docs/database.md) para una instalación nueva.

## Verificación y compilación

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd start
```

`tsconfig.json` compila solo `src/**/*.ts`, con `rootDir: src` y
`outDir: dist`. El resultado inicia en `dist/server.js`.
`package.json` y `package-lock.json` son propios del backend.
ESLint comprueba Node/TypeScript y Prettier su formato.
No iniciar dev y start simultáneamente en el mismo puerto.

El [índice de código](../docs/codigo.md) explica cada módulo.
`render.yaml` mantiene `rootDir: backend`; esta tarea no publica servicios.
