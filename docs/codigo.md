# Guía del código · frontend y backend separados

Esta guía describe la estructura actual. Las rutas se expresan desde la raíz
del repositorio. Cada archivo de código incluye un comentario de módulo; los
puntos críticos HTTP/SQL tienen documentación adicional junto a las funciones.

## 1. Qué pertenece a cada aplicación

- **frontend/src/**: React Native, componentes, estado de interfaz y HTTP.
- **frontend/app/**: rutas Expo Router; pertenece solo al frontend.
- **backend/src/**: Node.js, Express, validación del servidor y mysql2.
- **backend/database/**: scripts administrativos SQL, fuera del bundle y de src.
- No se importan módulos entre frontend y backend. Los contratos TypeScript se
  definen por separado y la comunicación real es JSON por HTTP.
- Cada aplicación tiene su propio package.json, lockfile, node_modules y .env.
  La raíz solo redirige comandos; no instala Express en React Native.

## 2. Seguir una solicitud de login

1. `frontend/src/components/organisms/LoginForm.tsx`: el botón Ingresar llama a
   `handleSubmit`, enfoca el primer campo inválido y solicita `submit()`.
2. `frontend/src/hooks/useLoginForm.ts`: valida, evita envíos simultáneos y llama
   a `signIn({ email, password })`.
3. `frontend/src/context/AuthContext.tsx`: `signIn` crea una cancelación y llama
   a `loginRequest`. No comprueba contraseñas localmente.
4. `frontend/src/services/authService.ts`: `loginRequest` selecciona
   `'login'`; `sendAuthRequest` realiza el **fetch POST**:

```ts
const response = await fetch(baseUrl + '/api/auth/' + route, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'omit',
  signal: controller.signal,
  body: JSON.stringify(body),
});
```

5. `backend/src/app.ts` monta `authRoutes` bajo `/api/auth`.
6. `backend/src/routes/authRoutes.ts` recibe `POST /login` y ejecuta, en orden:
   límite por IP → exigir JSON → parsear con límite de tamaño → validar → login.
7. `backend/src/controllers/authController.ts` busca el email, compara bcrypt,
   comprueba que la cuenta esté activa y registra el resultado.
8. `backend/src/models/userModel.ts` ejecuta SQL con parámetros, no concatenando
   el email dentro de la consulta. Un resultado ausente produce `null`.
9. El controlador devuelve 200 con `success: true` y usuario público, o 401 con
   `success: false`. No devuelve contraseña ni hash.
10. El frontend lee `response.json()` y valida su estructura con
    `responseGuards`. Un 200 con JSON inesperado también es un error.
11. `AuthContext` guarda `setUser(nextUser)` solo si la solicitud sigue vigente.
    `frontend/app/index.tsx` detecta el usuario válido y redirige a bienvenida.

**Qué significa “ingresó”:** el servidor verificó las credenciales y la interfaz
conserva el resultado en memoria. No existe token ni sesión persistente.
La validación por tipos/props no sustituye una autorización de servidor.

## 3. Paso por props a la bienvenida

`frontend/app/welcome.tsx` obtiene el usuario de `useAuth()`, valida su forma
y entrega:

```tsx
<WelcomePage user={publicUser} onLogout={handleLogout} />
```

`frontend/src/pages/WelcomePage.tsx` recibe `{ user, onLogout }` con
`WelcomePageProps`, definido en `frontend/src/types/auth.ts`.
Los datos visibles provienen de `user.name`, `user.email`, `user.role`,
`user.id` y `user.lastLoginAt`. No se duplican en parámetros de URL.
Salir limpia el contexto y vuelve al login.

## 4. Seguir el registro

`RegistrationForm` → `useRegistrationForm` → `registrationRequest` →
`sendAuthRequest('register', ...)` → `POST /api/auth/register` →
validación de servidor → `register` → `bcrypt.hash` → `createUser`.

- El frontend valida la confirmación de contraseña, pero solo envía name,
  email y password.
- El backend vuelve a validar, decide el rol student y guarda el hash bcrypt.
- El email único protege contra duplicados incluso con solicitudes simultáneas.
- Un alta correcta devuelve 201 y no inicia sesión automáticamente.
- Contraseña, confirmación y datos SQL privados no se conservan en AsyncStorage.

## 5. Índice de todos los módulos

Los siguientes módulos conservan su comportamiento; la reorganización cambia
su ubicación, el arranque y la documentación, no las reglas de negocio.

### Frontend · React Native

| Archivo                                                                                                               | Función                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`frontend/src/components/atoms/AppText.tsx`](../frontend/src/components/atoms/AppText.tsx)                           | Recibe props de Text y variantes tipográficas; aplica los colores del tema sin desactivar el escalado de texto.                                                                                                                           |
| [`frontend/src/components/atoms/Button.tsx`](../frontend/src/components/atoms/Button.tsx)                             | Recibe etiqueta, acción y estado de carga. Impide nuevos envíos mientras está ocupado y muestra un indicador accesible.                                                                                                                   |
| [`frontend/src/components/atoms/Card.tsx`](../frontend/src/components/atoms/Card.tsx)                                 | Recibe contenido y estilos de View; aporta una superficie con bordes y sombra según el tema.                                                                                                                                              |
| [`frontend/src/components/atoms/EntranceView.tsx`](../frontend/src/components/atoms/EntranceView.tsx)                 | Anima la entrada del contenido y respeta la preferencia de movimiento reducido; no gestiona datos ni navegación.                                                                                                                          |
| [`frontend/src/components/atoms/IconButton.tsx`](../frontend/src/components/atoms/IconButton.tsx)                     | Expone una acción mediante un icono y una etiqueta accesible, con área táctil mínima.                                                                                                                                                     |
| [`frontend/src/components/atoms/Input.tsx`](../frontend/src/components/atoms/Input.tsx)                               | Extiende TextInput con estado visual de foco y error. El valor y sus cambios siguen controlados por el formulario.                                                                                                                        |
| [`frontend/src/components/atoms/ScrollToTopButton.tsx`](../frontend/src/components/atoms/ScrollToTopButton.tsx)       | Recibe visibilidad y acción de desplazamiento. Anima el control sin decidir cuándo debe mostrarse.                                                                                                                                        |
| [`frontend/src/components/atoms/ThemeToggleButton.tsx`](../frontend/src/components/atoms/ThemeToggleButton.tsx)       | Consume el contexto visual para alternar claro/oscuro; se oculta cuando el teclado ocupa la pantalla.                                                                                                                                     |
| [`frontend/src/components/molecules/BrandHeader.tsx`](../frontend/src/components/molecules/BrandHeader.tsx)           | Presenta la identidad compartida de las pantallas. No contiene solicitudes HTTP ni decisiones de acceso.                                                                                                                                  |
| [`frontend/src/components/molecules/FormNotice.tsx`](../frontend/src/components/molecules/FormNotice.tsx)             | Recibe un mensaje y su tono visual; anuncia errores o confirmaciones con atributos de accesibilidad.                                                                                                                                      |
| [`frontend/src/components/molecules/InfoRow.tsx`](../frontend/src/components/molecules/InfoRow.tsx)                   | Compone icono, título y descripción a partir de props para reutilizar explicaciones en distintas pantallas.                                                                                                                               |
| [`frontend/src/components/molecules/TextField.tsx`](../frontend/src/components/molecules/TextField.tsx)               | Compone etiqueta, Input, errores y control de visibilidad de contraseña; reenvía los eventos del campo.                                                                                                                                   |
| [`frontend/src/components/molecules/UserDetailRow.tsx`](../frontend/src/components/molecules/UserDetailRow.tsx)       | Muestra una etiqueta y un dato público recibido por props, sin consultar la base de datos.                                                                                                                                                |
| [`frontend/src/components/organisms/LoginForm.tsx`](../frontend/src/components/organisms/LoginForm.tsx)               | Conecta los campos con useLoginForm; el botón Ingresar inicia la validación y la solicitud al backend.                                                                                                                                    |
| [`frontend/src/components/organisms/RegistrationForm.tsx`](../frontend/src/components/organisms/RegistrationForm.tsx) | Conecta los cuatro campos con useRegistrationForm. La confirmación de contraseña se valida localmente y no se envía.                                                                                                                      |
| [`frontend/src/components/organisms/ScreenShell.tsx`](../frontend/src/components/organisms/ScreenShell.tsx)           | Envuelve las pantallas con áreas seguras, manejo del teclado y scroll; reserva espacio para los controles flotantes.                                                                                                                      |
| [`frontend/src/constants/app.ts`](../frontend/src/constants/app.ts)                                                   | Claves y medidas comunes sin secretos ni estilos dispersos.                                                                                                                                                                               |
| [`frontend/src/constants/messages.ts`](../frontend/src/constants/messages.ts)                                         | Mensajes públicos centralizados para el formulario y la red.                                                                                                                                                                              |
| [`frontend/src/context/AuthContext.tsx`](../frontend/src/context/AuthContext.tsx)                                     | signIn solicita el login y conserva únicamente el usuario público validado. signOut lo borra y cancela solicitudes pendientes. El estado es temporal: no hay JWT, cookie de sesión ni autenticación persistente del servidor.             |
| [`frontend/src/context/ThemeContext.tsx`](../frontend/src/context/ThemeContext.tsx)                                   | Lee y guarda solo la preferencia visual en AsyncStorage; sin elección explícita utiliza el modo del sistema.                                                                                                                              |
| [`frontend/src/hooks/useAuth.ts`](../frontend/src/hooks/useAuth.ts)                                                   | Devuelve usuario, estado de envío, signIn y signOut. Requiere estar dentro de AuthProvider.                                                                                                                                               |
| [`frontend/src/hooks/useBreakpoint.ts`](../frontend/src/hooks/useBreakpoint.ts)                                       | Usa el ancho actual de la ventana para distinguir móvil, tablet y escritorio, incluso al rotar el dispositivo.                                                                                                                            |
| [`frontend/src/hooks/useKeyboardVisible.ts`](../frontend/src/hooks/useKeyboardVisible.ts)                             | Suscribe los eventos del teclado nativo y elimina sus listeners al desmontar el componente.                                                                                                                                               |
| [`frontend/src/hooks/useLoginForm.ts`](../frontend/src/hooks/useLoginForm.ts)                                         | Controla email, contraseña, errores y envío. Valida antes de llamar signIn y limpia la contraseña tras un ingreso correcto.                                                                                                               |
| [`frontend/src/hooks/useReducedMotion.ts`](../frontend/src/hooks/useReducedMotion.ts)                                 | Consulta y observa la preferencia de accesibilidad para que las animaciones puedan desactivarse.                                                                                                                                          |
| [`frontend/src/hooks/useRegistrationForm.ts`](../frontend/src/hooks/useRegistrationForm.ts)                           | Controla los campos y su confirmación; llama registrationRequest, cancela al desmontar y vacía los datos tras crear la cuenta.                                                                                                            |
| [`frontend/src/hooks/useScrollToTop.ts`](../frontend/src/hooks/useScrollToTop.ts)                                     | Expone referencia, eventos de scroll, visibilidad y acción para volver arriba cuando se supera el umbral.                                                                                                                                 |
| [`frontend/src/hooks/useTheme.ts`](../frontend/src/hooks/useTheme.ts)                                                 | Entrega el tema y su operación de cambio. Lanza un error claro si falta ThemeProvider.                                                                                                                                                    |
| [`frontend/src/pages/LoginPage.tsx`](../frontend/src/pages/LoginPage.tsx)                                             | Compone el formulario y la presentación responsive. Recibe onRegister como prop para no acoplarse al enrutador.                                                                                                                           |
| [`frontend/src/pages/RegisterPage.tsx`](../frontend/src/pages/RegisterPage.tsx)                                       | Compone el formulario de alta y el diseño responsive; recibe onLogin para volver al ingreso.                                                                                                                                              |
| [`frontend/src/pages/WelcomePage.tsx`](../frontend/src/pages/WelcomePage.tsx)                                         | Recibe user y onLogout mediante props tipadas. Presenta los datos públicos devueltos por la API, nunca contraseñas.                                                                                                                       |
| [`frontend/src/services/apiConfig.ts`](../frontend/src/services/apiConfig.ts)                                         | Valida una URL HTTP/HTTPS de origen, sin rutas, consultas ni credenciales. Solo lee EXPO_PUBLIC_API_URL.                                                                                                                                  |
| [`frontend/src/services/authService.ts`](../frontend/src/services/authService.ts)                                     | loginRequest envía email/password a /api/auth/login; registrationRequest envía name/email/password a /api/auth/register. sendAuthRequest realiza POST JSON, aplica timeout/cancelación y valida estado HTTP y estructura de la respuesta. |
| [`frontend/src/styles/breakpoints.ts`](../frontend/src/styles/breakpoints.ts)                                         | Clasifica el ancho; la altura sigue disponible para rotación.                                                                                                                                                                             |
| [`frontend/src/styles/colors.ts`](../frontend/src/styles/colors.ts)                                                   | Paleta violeta/fucsia con texto de contraste en ambos modos.                                                                                                                                                                              |
| [`frontend/src/styles/shadows.ts`](../frontend/src/styles/shadows.ts)                                                 | Sombras compatibles con web y la arquitectura actual de React Native.                                                                                                                                                                     |
| [`frontend/src/styles/spacing.ts`](../frontend/src/styles/spacing.ts)                                                 | Escala coherente para espacios y bordes de toda la interfaz.                                                                                                                                                                              |
| [`frontend/src/styles/theme.ts`](../frontend/src/styles/theme.ts)                                                     | Compone dos temas estables a partir de los tokens compartidos.                                                                                                                                                                            |
| [`frontend/src/styles/typography.ts`](../frontend/src/styles/typography.ts)                                           | Jerarquía tipográfica que conserva el escalado accesible.                                                                                                                                                                                 |
| [`frontend/src/types/auth.ts`](../frontend/src/types/auth.ts)                                                         | Contratos propios de credenciales, errores, usuario público y respuestas.                                                                                                                                                                 |
| [`frontend/src/types/theme.ts`](../frontend/src/types/theme.ts)                                                       | Contratos del tema; solo se persiste la preferencia visual.                                                                                                                                                                               |
| [`frontend/src/utils/ApiError.ts`](../frontend/src/utils/ApiError.ts)                                                 | Clasifica errores de configuración, red, timeout, cancelación y HTTP; expone mensajes públicos y errores por campo.                                                                                                                       |
| [`frontend/src/utils/responseGuards.ts`](../frontend/src/utils/responseGuards.ts)                                     | Trata el JSON remoto como unknown y devuelve contratos tipados o null. Solo copia campos públicos permitidos.                                                                                                                             |
| [`frontend/src/utils/userPresentation.ts`](../frontend/src/utils/userPresentation.ts)                                 | Formatea fecha UTC y etiqueta de rol para la interfaz, sin inventar valores ausentes ni modificar datos del servidor.                                                                                                                     |
| [`frontend/src/utils/validation.ts`](../frontend/src/utils/validation.ts)                                             | Valida campos localmente y cuenta bytes UTF-8 sin depender de Buffer.                                                                                                                                                                     |
| [`frontend/app/_layout.tsx`](../frontend/app/_layout.tsx)                                                             | Instala ThemeProvider y AuthProvider alrededor de Expo Router; comparte barra de estado y controles visuales.                                                                                                                             |
| [`frontend/app/index.tsx`](../frontend/app/index.tsx)                                                                 | Muestra LoginPage si no hay usuario público válido; si lo hay, redirige a la bienvenida.                                                                                                                                                  |
| [`frontend/app/register.tsx`](../frontend/app/register.tsx)                                                           | Muestra RegisterPage y entrega la acción de volver al login; evita mostrar el registro a quien ya ingresó.                                                                                                                                |
| [`frontend/app/welcome.tsx`](../frontend/app/welcome.tsx)                                                             | Comprueba el usuario del contexto y lo pasa a WelcomePage mediante user={publicUser}; al salir limpia el estado.                                                                                                                          |

### Backend · Node.js

| Archivo                                                                                                       | Función                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`backend/src/app.ts`](../backend/src/app.ts)                                                                 | Compone Express sin iniciar puertos ni depender de la interfaz.                                                                                                                                                                             |
| [`backend/src/server.ts`](../backend/src/server.ts)                                                           | Inicia Express con host/puerto validados. Gestiona tiempos de espera y cierra HTTP y el pool al recibir señales de salida.                                                                                                                  |
| [`backend/src/config/database.ts`](../backend/src/config/database.ts)                                         | Crea el pool MySQL con la cuenta limitada del backend. withDatabaseConnection fija UTC y libera la conexión incluso si falla. Los secretos se leen del entorno del servidor y nunca se importan desde React Native.                         |
| [`backend/src/config/environment.ts`](../backend/src/config/environment.ts)                                   | Carga backend/.env desde el directorio de ejecución y valida puertos, CORS, TLS y credenciales SQL antes de iniciar. Rechaza root y contraseñas de ejemplo; no imprime valores privados.                                                    |
| [`backend/src/config/password.ts`](../backend/src/config/password.ts)                                         | Genera un hash bcrypt ficticio para comparar también cuando no existe el email y evitar una salida inmediata distinta.                                                                                                                      |
| [`backend/src/constants/auth.ts`](../backend/src/constants/auth.ts)                                           | Límites de autenticación y mensajes públicos del servidor.                                                                                                                                                                                  |
| [`backend/src/controllers/authController.ts`](../backend/src/controllers/authController.ts)                   | register cifra la contraseña y crea una cuenta student. login busca el email, compara bcrypt y registra el intento. Devuelve JSON público: 201 para alta, 200 para ingreso correcto o 401 genérico para credenciales rechazadas.            |
| [`backend/src/controllers/healthController.ts`](../backend/src/controllers/healthController.ts)               | health comprueba que HTTP responde; ready ejecuta SELECT 1 para comprobar SQL y responde 503 si no está disponible.                                                                                                                         |
| [`backend/src/middlewares/corsMiddleware.ts`](../backend/src/middlewares/corsMiddleware.ts)                   | Permite los orígenes web exactos configurados. CORS es una regla del navegador, no un mecanismo de autenticación.                                                                                                                           |
| [`backend/src/middlewares/errorHandler.ts`](../backend/src/middlewares/errorHandler.ts)                       | Convierte errores de validación, JSON y aplicación en respuestas públicas. Oculta consultas, hashes y secretos internos.                                                                                                                    |
| [`backend/src/middlewares/loginRateLimiter.ts`](../backend/src/middlewares/loginRateLimiter.ts)               | Limita los intentos POST de login por IP antes de leer el JSON y calcular bcrypt; responde 429 al exceder el máximo.                                                                                                                        |
| [`backend/src/middlewares/registrationRateLimiter.ts`](../backend/src/middlewares/registrationRateLimiter.ts) | Limita las altas por IP antes de validar y calcular hashes. El contador en memoria se reinicia con el proceso.                                                                                                                              |
| [`backend/src/middlewares/validateLogin.ts`](../backend/src/middlewares/validateLogin.ts)                     | requireJsonBody exige application/json. validateLogin acepta solo email/password y guarda datos validados en response.locals.                                                                                                               |
| [`backend/src/middlewares/validateRegistration.ts`](../backend/src/middlewares/validateRegistration.ts)       | Acepta solo name/email/password, rechaza parámetros en la URL y campos extra. El cliente no puede elegir rol ni estado.                                                                                                                     |
| [`backend/src/models/userModel.ts`](../backend/src/models/userModel.ts)                                       | Ejecuta SQL parametrizado para crear/buscar usuarios y registrar accesos. La base decide identificadores y rol student. Los intentos y su fecha se confirman en una transacción; ante un fallo se intenta rollback y se libera la conexión. |
| [`backend/src/routes/authRoutes.ts`](../backend/src/routes/authRoutes.ts)                                     | Define POST /register y POST /login. Ordena límite por IP, formato JSON, parseo, validación y controlador. app.ts monta estas rutas bajo /api/auth; otros métodos reciben 405 con el encabezado Allow.                                      |
| [`backend/src/routes/healthRoutes.ts`](../backend/src/routes/healthRoutes.ts)                                 | Define GET /health y GET /ready bajo /api; no comparte el flujo de credenciales del login.                                                                                                                                                  |
| [`backend/src/types/auth.ts`](../backend/src/types/auth.ts)                                                   | Contratos propios de credenciales, errores, usuario público y respuestas.                                                                                                                                                                   |
| [`backend/src/utils/HttpError.ts`](../backend/src/utils/HttpError.ts)                                         | Transporta estado HTTP, mensaje público y errores de campo hasta errorHandler; no incluye detalles de SQL.                                                                                                                                  |
| [`backend/src/utils/validation.ts`](../backend/src/utils/validation.ts)                                       | Valida datos desconocidos y límites de campos antes de usar las credenciales.                                                                                                                                                               |

## 6. Configuraciones y archivos sin comentarios internos

JSON no admite comentarios. Sus responsabilidades se documentan aquí:

| Archivo                   | Explicación                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `frontend/package.json`   | Expo/React Native, scripts y herramientas del cliente.                                    |
| `backend/package.json`    | Express/mysql2/bcrypt, Node >=24 y scripts del servidor.                                  |
| Ambos `package-lock.json` | Fijan las versiones; no se actualizaron dependencias por esta reorganización.             |
| `frontend/app.json`       | Nombre, esquema, iconos, plugins y opciones de Expo. Los assets son relativos a frontend. |
| `frontend/tsconfig.json`  | TypeScript estricto, alias @/* y solo rutas/código del frontend.                          |
| `backend/tsconfig.json`   | NodeNext; compila src a dist sin incluir código React Native.                             |
| Cada `eslint.config.js`   | Reglas propias: React Hooks en frontend, entorno Node en backend.                         |
| Cada `.prettierrc.json`   | Formato coherente; los ignores excluyen dependencias y generados.                         |
| `frontend/.env.example`   | URL pública del servidor, sin credenciales SQL.                                           |
| `backend/.env.example`    | Plantilla de conexión, CORS y límites; requiere valores privados locales.                 |
| `backend/examples/*.json` | Cuerpos ficticios para login válido, contraseña incorrecta y campos vacíos.               |
| `package.json` de raíz    | Atajos npm --prefix; no contiene paquetes de aplicación.                                  |
| `render.yaml`             | Raíz backend para API y frontend para web; no publica automáticamente esta corrección.    |
| `.gitignore`              | Excluye entornos privados, dependencias y resultados de compilación.                      |
| `.gitattributes`          | Finales de línea LF para texto y tratamiento binario de imágenes.                         |

### SQL

- `backend/database/schema.sql`: tablas roles/users/login_logs, índices,
  restricciones, relaciones y comentarios sobre datos privados y fechas.
- `seed.sql`: roles y cuentas ficticias; las contraseñas de ejemplo son públicas
  y no deben usarse para personas reales.
- `create_app_user.sql`: creación administrativa de una cuenta SQL limitada.
- `enable_registration.sql`: permisos de registro para instalaciones previas.
- `queries.sql`: ejemplos de consultas para explicar el modelo.

No ejecutar estos scripts automáticamente al iniciar. La base existente de
esta PC se conserva sin reimportarla.

## 7. Estilos, accesibilidad y ciclo de vida

Los componentes consumen tokens de styles y ThemeContext; las páginas cambian
la distribución según el ancho, no según un dispositivo fijo.
El tema se persiste; el usuario y las contraseñas no.
Los hooks eliminan listeners y cancelan solicitudes al desmontarse.
Los controles contemplan etiquetas accesibles, teclado, áreas seguras y
preferencia de movimiento reducido.

## 8. Seguridad y límites del ejercicio

El backend no confía en la validación del frontend: valida unknown, rechaza
campos extra y parámetros de URL, usa consultas parametrizadas y compara bcrypt.
CORS restringe navegadores por origen, pero no autentica clientes nativos.
Los rate limiters usan memoria del proceso. Para producción se necesitarían
autorización de recursos, sesiones/tokens y controles operativos adicionales.

Ver [contrato HTTP](../backend/README.md), [frontend](../frontend/README.md) y
[reorganización](separacion.md).
