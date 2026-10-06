# Parte 3 — Backend de acceso de usuarios

> Documento de etapa: describe el estado al cerrar la Parte 3. La interfaz ya se
> conectó en Parte 5; el estado final está en README y delivery.md.

La API Express + TypeScript ya está implementada. La interfaz sigue provisional:
el formulario real y la bienvenida se conectan en las Partes 4 y 5.
No se modificaron los proyectos 1 y 2 ni la base habitual de XAMPP.

## Árbol real de esta parte

Se omiten node_modules/, dist/ y el archivo privado .env.
El código completo está en estos archivos; no hay funciones de login pendientes.

```text
backend/
├── config/
│   ├── database.ts
│   ├── environment.ts
│   └── password.ts
├── constants/
│   └── auth.ts
├── controllers/
│   ├── authController.ts
│   └── healthController.ts
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── create_app_user.sql
│   └── queries.sql
├── examples/
│   ├── login-request.json
│   ├── incorrect-password.json
│   └── empty-fields.json
├── middlewares/
│   ├── corsMiddleware.ts
│   ├── errorHandler.ts
│   ├── loginRateLimiter.ts
│   └── validateLogin.ts
├── models/
│   └── userModel.ts
├── routes/
│   ├── authRoutes.ts
│   └── healthRoutes.ts
├── types/
│   └── auth.ts
├── utils/
│   ├── HttpError.ts
│   └── validation.ts
├── app.ts
├── server.ts
├── .env.example
├── package.json
├── package-lock.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc.json
└── .prettierignore
```

Todos los archivos TypeScript empiezan con su ruta y propósito en español.
Los archivos JSON no admiten comentarios: los tres ejemplos contienen únicamente
credenciales ficticias del seed para probar la API, no secretos de MySQL.

## Cómo se reparte la responsabilidad

| Capa                      | Responsabilidad                                                                |
| ------------------------- | ------------------------------------------------------------------------------ |
| config                    | Validar entorno, configurar el pool y generar un hash de comparación ficticio. |
| routes                    | Declarar endpoints y ordenar sus middlewares.                                  |
| middlewares               | CORS, límite por IP, validación y respuesta uniforme de errores.               |
| controllers               | Comparar credenciales, registrar el resultado y construir el JSON público.     |
| models                    | Ejecutar SQL parametrizado y transacciones; no generar respuestas HTTP.        |
| types / constants / utils | Contratos estrictos, mensajes compartidos y validaciones reutilizables.        |
| app.ts                    | Componer Express sin abrir el puerto.                                          |
| server.ts                 | Escuchar HTTP y cerrar servidor/pool de forma ordenada.                        |

Flujo del login:

```text
POST JSON → Helmet/CORS → límite por IP → parser/validación
→ búsqueda parametrizada → bcrypt.compare → registro del intento
→ JSON público 200 o mensaje genérico 401
```

Express 5 deriva los rechazos de handlers async al middleware central de errores.
Un fallo SQL o de registro produce 500: no se informa éxito sin registrar el evento.

## Preparación local

1. Seguir [la Parte 2](database.md): iniciar MySQL de XAMPP, importar schema.sql,
   luego seed.sql, y crear np_login_app@127.0.0.1 con contraseña privada.
2. Editar backend/.env con esa misma contraseña, de al menos 24 caracteres.
   No es ninguna de las contraseñas públicas del formulario.
3. Comprobar DB_HOST, DB_PORT, DB_NAME y DB_USER. La API rechaza root,
   contraseñas ausentes y placeholders conocidos.
4. Definir CORS_ORIGINS con los orígenes exactos del frontend **web**, separados
   por comas. Por ejemplo http://localhost:8083; sin ruta final ni comodines.
5. Instalar y arrancar desde la raíz del proyecto:

```powershell
Set-Location "C:\Users\parro\OneDrive\Desktop\react-native-tps\proyecto-3-acceso-usuarios"
npm --prefix backend ci
npm --prefix backend run dev
```

Para ejecutar el compilado, en lugar del modo de desarrollo:

```powershell
npm --prefix backend run build
npm --prefix backend start
```

La configuración se valida antes de escuchar. El pool se conecta cuando llega
una operación SQL, no durante /api/health. Un servidor iniciado no prueba la BD.

**Situación de esta entrega:** la prueba usó una instancia aislada con credenciales
temporales. La importación en el XAMPP habitual y su contraseña privada en .env
siguen pendientes; no se adivinaron ni se publicaron credenciales administrativas.

### Variables relevantes

| Variable                   | Valor de ejemplo / regla                                           |
| -------------------------- | ------------------------------------------------------------------ |
| HOST / PORT                | 0.0.0.0 / 3000: permite probar en la LAN; no abrir a Internet.     |
| DB_HOST / DB_PORT          | 127.0.0.1 / 3306.                                                  |
| DB_NAME / DB_USER          | np_user_access / np_login_app; nunca root.                         |
| DB_PASSWORD                | Contraseña privada del usuario SQL, mínimo 24 caracteres.          |
| DB_TIMEOUT_MS              | 5000; intervalo admitido 1000–30000 ms.                            |
| CORS_ORIGINS               | Orígenes HTTP/HTTPS exactos del cliente web.                       |
| LOGIN_RATE_LIMIT_WINDOW_MS | 900000 ms: 15 minutos.                                             |
| LOGIN_RATE_LIMIT_MAX       | 10 solicitudes POST por IP durante esa ventana.                    |
| BCRYPT_ROUNDS              | 12; solo configura el hash ficticio al iniciar, no cambia el seed. |

El pool limita a 10 conexiones y 20 solicitudes en cola. El tiempo de conexión
y de las consultas explícitas usa DB_TIMEOUT_MS; no es un plazo total de extremo
a extremo. El timeout HTTP protege la recepción de la solicitud, no sustituye
el futuro timeout del cliente. Las fechas SQL se interpretan y devuelven en UTC.

## Contrato HTTP

### GET /api/health

HTTP 200:

```json
{
  "success": true,
  "message": "Servidor disponible."
}
```

Es **liveness**: comprueba que Express responde, incluso con MySQL apagado.
No significa que el login ni la conexión SQL estén disponibles.

### POST /api/auth/login

Content-Type: application/json. Cuerpo:

```json
{
  "email": "student@np.test",
  "password": "StudentDemo!2026"
}
```

HTTP 200, ejemplo; la fecha corresponde al evento actual y varía:

```json
{
  "success": true,
  "message": "Ingreso correcto.",
  "user": {
    "id": 2,
    "name": "Estudiante Demo",
    "email": "student@np.test",
    "role": "student",
    "lastLoginAt": "2026-10-05T12:00:00.000Z"
  }
}
```

El nombre y el id los determina el seed importado; no se construyen desde
los datos enviados por el cliente. La respuesta selecciona explícitamente
id, name, email, role y lastLoginAt, sin password ni password_hash.

HTTP 400, campos vacíos:

```json
{
  "success": false,
  "message": "Revisá los datos del formulario.",
  "errors": {
    "email": "Ingresá tu email.",
    "password": "Ingresá tu contraseña."
  }
}
```

HTTP 401, misma respuesta para email inexistente, contraseña incorrecta
o cuenta inactiva:

```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

HTTP 429:

```json
{
  "success": false,
  "message": "Demasiados intentos. Esperá un momento y volvé a intentar."
}
```

Incluye Retry-After y cabeceras RateLimit; no realiza una consulta SQL.

HTTP 500, incluida la caída de MySQL o un timeout de conexión:

```json
{
  "success": false,
  "message": "No se pudo completar la solicitud. Intentá nuevamente."
}
```

Otros códigos: 403 origen no permitido, 404 ruta inexistente, 405 método incorrecto
en login (Allow: POST, OPTIONS), 413 cuerpo demasiado grande y 415 formato no admitido.
El preflight permitido responde 204 sin consumir un intento de login.

### Política de validación

- Acepta solo un objeto JSON con email y password; rechaza arrays, null,
  campos extra y parámetros de consulta en la URL.
- Email: string, recortado y convertido a minúsculas, ASCII, hasta 254 caracteres,
  parte local hasta 64 y dominio con al menos dos etiquetas válidas.
  Es una política práctica; no afirma soportar todas las variantes del estándar.
- Password: string, mínimo 8 caracteres Unicode y máximo 72 bytes UTF-8,
  porque bcrypt limita a 72 bytes. No se recorta ni transforma la contraseña.
- Vacíos o contraseña compuesta solo por espacios: 400. JSON máximo 4 KB.
- Una solicitud inválida no crea login_logs: el registro corresponde a
  comparaciones de credenciales realizadas, no a cualquier tráfico HTTP.

## Pruebas con curl y Postman

En Windows usar curl.exe para evitar el alias de PowerShell.
Los archivos evitan problemas al escapar JSON. Ejecutar desde la raíz,
con la base importada y el servidor iniciado.

```powershell
curl.exe -i http://localhost:3000/api/health
curl.exe -i -H "Content-Type: application/json" --data-binary "@backend/examples/login-request.json" http://localhost:3000/api/auth/login
curl.exe -i -H "Content-Type: application/json" --data-binary "@backend/examples/incorrect-password.json" http://localhost:3000/api/auth/login
curl.exe -i -H "Content-Type: application/json" --data-binary "@backend/examples/empty-fields.json" http://localhost:3000/api/auth/login
```

Resultados esperados, en ese orden: 200, 200, 401 y 400.
En Linux/macOS cambiar curl.exe por curl.

En Postman: crear POST a http://localhost:3000/api/auth/login,
seleccionar Body → raw → JSON y pegar el contenido de login-request.json.
Consultar status y body; no reenviar la respuesta como contraseña.

| Prueba manual        | Cambio en el cuerpo / entorno                     | Resultado esperado              |
| -------------------- | ------------------------------------------------- | ------------------------------- |
| Administrador        | admin@np.test / AdminDemo!2026                    | 200, role admin.                |
| Inactivo             | inactive@np.test / InactiveDemo!2026              | 401 genérico.                   |
| Inexistente          | missing@np.test / StudentDemo!2026                | 401 idéntico.                   |
| Email inválido       | email: "sin-arroba"                               | 400, errors.email.              |
| Contraseña corta     | password: "123"                                   | 400, errors.password.           |
| JSON incorrecto      | Enviar un objeto sin cerrar                       | 400.                            |
| Formato incorrecto   | Content-Type: text/plain                          | 415.                            |
| Método incorrecto    | GET /api/auth/login                               | 405.                            |
| Origen web permitido | Header Origin: http://localhost:8083              | Allow-Origin exacto.            |
| Origen web ajeno     | Header Origin: https://example.invalid            | 403.                            |
| Límite de intentos   | Enviar 11 POST desde la misma IP en 15 minutos    | 429 en el excedente.            |
| MySQL apagado        | Detener solo tu servicio de prueba y enviar login | 500; health sigue 200.          |
| API apagada          | Detener Express y consultar con curl              | Error de conexión, no JSON 500. |

Todos los POST admitidos por CORS consumen el límite, incluidos los exitosos
y los mal formados. Para repetir muchas pruebas, esperar la ventana o reiniciar
tu servidor local; no desactivar la protección en una publicación.

## Seguridad y persistencia

- SQL mediante execute con parámetros; nunca concatenar el email a una consulta.
- bcrypt.compare trabaja con el hash interno. Si el usuario no existe se compara
  con un hash ficticio, sin retorno rápido. Esto reduce diferencias obvias de tiempo,
  pero no garantiza tiempo idéntico ni elimina todos los canales de enumeración.
- Un intento conocido guarda user_id; uno inexistente guarda NULL.
  attempted_email conserva lo intentado y success indica el resultado.
  Es información personal: restringir acceso y definir retención antes de producción.
- INSERT del evento y cálculo MAX de accesos exitosos se confirman en una transacción.
  lastLoginAt se deriva de los eventos; no se duplica en users.
- La cuenta dedicada solo lee columnas necesarias e inserta intentos. No modifica
  usuarios ni tiene UPDATE, DELETE o DDL.
- El middleware central no expone consultas, stacks, passwords o hashes.
  La consola informa errores genéricos; no registra cuerpos de solicitudes.
- /api responde con Cache-Control: no-store; Helmet agrega cabeceras de protección.
- CORS no es autenticación: restringe el acceso de navegadores, no impide curl.
  Solicitudes sin Origin se admiten para Expo Go y clientes nativos.
- trust proxy es false: no confiar en X-Forwarded-For enviado por el cliente.
  El limiter mantiene el contador en memoria y reiniciarlo lo borra.
- Sin JWT, cookies ni sesión de servidor: esta etapa verifica credenciales.
  Una bienvenida no protegerá futuros endpoints por sí sola.
- Producción futura: HTTPS, credenciales propias sin el seed público, permisos revisados,
  JWT/autorización y SecureStore, almacén compartido del limiter y configuración
  explícita del proxy confiable. Nada de eso se implementa fuera del alcance.
- .env y archivos _.local.sql quedan fuera del repositorio y del ZIP.
  EXPO_PUBLIC__ nunca debe contener datos SQL ni secretos.

## Verificación realizada

El 5 de octubre de 2026 se ejecutaron **46 comprobaciones** contra HTTP real,
el backend compilado y MariaDB 10.4.32 aislada. Se comprobaron:

- Login estudiante/administrador, campos públicos, UTC y registro de intentos.
- 401 idéntico para email desconocido, password incorrecto y usuario inactivo.
- Campos/tipos inválidos, límites Unicode/72 bytes, normalización del email,
  preservación de espacios de contraseña y email con apóstrofo como parámetro SQL.
- JSON mal formado, arrays, null, cuerpo grande, tipo MIME, parámetros URL,
  métodos incorrectos y rutas inexistentes.
- CORS permitido/denegado/preflight y cabeceras de seguridad/no caché.
- 429 y Retry-After con un límite reducido solo en el proceso aislado de prueba;
  ignorar X-Forwarded-For falsificado.
- MySQL realmente detenido → 500 genérico, sin filtrar SQL; health sigue 200.
- Conexión TCP aceptada sin handshake MySQL → timeout de conexión y 500 genérico.
- Rechazo de root y de password placeholder al iniciar; ausencia de secretos en logs.

La base habitual de XAMPP no fue alterada. No se ejecutó aún el flujo de login en
Expo Go ni se verificó MySQL 8 por separado. No hay una suite permanente añadida
a un repositorio que no tenía tests; los ejemplos permiten repetir pruebas manuales.

Comprobaciones del código:

```powershell
npm run check
npm --prefix backend run check
npm --prefix backend run build
```

## ¿Qué rúbrica cubre esto?

- [x] Express + TypeScript estricto y separación por responsabilidades.
- [x] POST login, GET health y contratos JSON; códigos 400/401/429/500.
- [x] Validación del servidor, SQL parametrizado, bcrypt y mensajes genéricos.
- [x] Registro de intentos, fecha derivada y usuario SQL con privilegios mínimos.
- [x] CORS, Helmet, rate limiting y exclusión de secretos.
- [x] Código comentado en español y ejemplos curl/Postman reproducibles.
- [ ] Configurar la base habitual y su contraseña SQL privada.
- [ ] Formulario, bienvenida con props, temas y scroll: Partes 4 y 5.
- [ ] Pruebas nativas, documentación final y publicación: Parte 6.

## Preguntas para defender esta parte

**¿Por qué POST y no GET?** Las credenciales van en el cuerpo, no en la URL,
donde pueden quedar en historial o logs; HTTPS sigue siendo obligatorio fuera de la LAN.

**¿Qué evita una consulta parametrizada?** El SQL y los valores viajan separados;
un email con comillas se interpreta como dato, no como instrucciones SQL.

**¿Un hash es cifrado?** No: bcrypt es un hash con salt y coste de trabajo.
Se compara la contraseña presentada; no se recupera el texto original del hash.

**¿Por qué responder igual si el email no existe?** Para no revelar directamente
qué cuentas están registradas. También se ejecuta una comparación ficticia.

**¿Por qué health responde con la BD apagada?** Su responsabilidad es liveness de
Express; la disponibilidad del login se comprueba haciendo una operación SQL.

**¿CORS protege todo el servidor?** No. Es una política de navegador, no una
autorización. Un cliente nativo o curl no depende de esa política.

**¿Por qué registrar antes de responder éxito?** Para no presentar un ingreso
confirmado si no pudo persistirse el evento que respalda su fecha.

**¿Qué falta para proteger nuevas rutas?** Autorización y una sesión/token verificable;
los datos públicos recibidos tras el login no son una prueba de identidad.

## Fuentes oficiales

- [Errores async en Express 5](https://expressjs.com/en/guide/error-handling/)
- [Consultas preparadas de mysql2](https://sidorares.github.io/node-mysql2/docs/examples/queries/prepared-statements)
- [bcrypt y límite de 72 bytes](https://github.com/kelektiv/node.bcrypt.js)
- [Middleware CORS](https://github.com/expressjs/cors)
- [Configuración de express-rate-limit](https://express-rate-limit.mintlify.app/reference/configuration)

Escribí **continuar** para la Parte 4: bases del frontend, sin saltar todavía
a las pantallas de la Parte 5.
