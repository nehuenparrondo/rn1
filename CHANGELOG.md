# Historial de cambios

Formato inspirado en Keep a Changelog. Versionado semántico.

## [Sin publicar]

- Pendiente: confirmación de pruebas nativas y publicación verificada en GitHub.
- Pendiente: avisos transitivos sin parche compatible y hosting, si se exige una URL pública.
- No hay versión 1.0.0 ni release publicada hasta verificar esos pendientes.

## [0.5.2] - 2026-10-05

### Corregido

- Override acotado xcode/uuid 11.1.1 compatible con el generador de identificadores.
- Reducción de 29 a 22 avisos frontend sin cambiar Expo SDK 57.

### Operación

- Base habitual XAMPP provisionada con scripts públicos y cuenta SQL limitada.
- Password aleatorio solo en backend/.env privado; otras bases/cuentas intactas.
- Login y bienvenida comprobados con la instancia habitual, ya no solo aislada.
- QR preparado para prueba iPhone y destino GitHub autorizado por el usuario.
- Revisión de avisos sin parche y límites de publicación en docs/security.md.

## [0.5.1] - 2026-10-05

### Documentación

- README final con navegación a las guías, flujo de props y capturas web reales.
- Catálogo de componentes, hooks y contratos del frontend.
- Guía Git con commits convencionales, ramas y publicación manual sin secretos.
- Matriz de rúbrica con evidencia por requisito y pendientes explícitos.
- Plan de pruebas repetible, registro de validaciones y checklist Android/iOS.
- Guía de defensa oral con recorrido del código, preguntas y respuestas.
- Lista de entrega y límites: sin JWT, sesión persistente ni hosting configurado.

### Decisiones

- Revisión documental 0.5.1; el backend conserva 0.3.0 y no cambia el SDK ni la API.
- No se crean commits, ramas, remotos ni publicaciones sin una solicitud expresa.
- Las capturas móviles son viewports web, no ejecución en Expo Go.

## [0.5.0] - 2026-10-05

### Agregado

- LoginPage responsive con formulario real y validación debajo de cada input.
- LoginForm con Next/Done, foco, mostrar/ocultar contraseña y bloqueo con spinner.
- WelcomePage con usuario público recibido mediante props tipadas.
- Rutas finas que validan estado en memoria; no transmiten datos personales en URL.
- Bienvenida con datos reales, fecha local del evento, preferencias y cerrar sesión.
- Protección de acceso directo y limpieza del estado al salir o recargar.
- Entrada animada y transición Stack con movimiento reducido.
- Pruebas web con Express y MariaDB aislada, incluidos fallos reales de API y BD.

### Decisiones

- Context mantiene el estado del ingreso; WelcomeRoute valida y pasa User por props.
- Las props no se consideran autorización de futuros endpoints.
- XAMPP habitual y archivos .env privados siguen sin modificarse.
- El backend conserva 0.3.0; la integración no cambia sus contratos ni privilegios.

## [0.4.0] - 2026-10-05

### Agregado

- Tokens violeta/fucsia, dos temas, tipografía, spacing, sombras y breakpoints.
- ThemeProvider con preferencia del sistema y persistencia ordenada en AsyncStorage.
- AuthProvider en memoria con cancelación y protección frente a respuestas tras logout.
- Hooks de formulario, tamaño, teclado, movimiento reducido y scroll-to-top.
- Servicio fetch con POST, timeout de 10 segundos y validación de JSON remoto.
- Atomic Design: textos, inputs, botones, tarjetas, TextField y ScreenShell.
- Providers en el layout y controles flotantes de tema/scroll sin superposición.
- 53 comprobaciones de utilidades/servicio con HTTP local y revisión web responsive.

### Decisiones

- Solo se persiste el tema: usuario y credenciales no se guardan en AsyncStorage.
- El scroll aparece al superar 240 puntos y se oculta si no hay desplazamiento.
- Tema abajo a la derecha; scroll arriba, según la rúbrica del proyecto 3.
- Se mantiene una pantalla provisional; formulario y bienvenida corresponden a la Parte 5.
- El backend conserva su versión 0.3.0: no se modificó su código en esta parte.

## [0.3.0] - 2026-10-05

### Agregado

- Backend Express completo con TypeScript estricto y errores centralizados.
- Login POST parametrizado, comparación bcrypt y respuesta pública sin hash.
- Validación JSON, campos y límite UTF-8 de contraseña; errores por campo.
- Registro transaccional de intentos y último acceso derivado en UTC.
- CORS con orígenes exactos, Helmet y rate limiting por IP.
- Configuración que rechaza root y contraseñas SQL placeholder; pool limitado.
- Guía de API, ejemplos curl/Postman y 46 comprobaciones HTTP con MariaDB aislada.

### Decisiones

- Health comprueba Express, no la disponibilidad de la base de datos.
- No se agregan JWT, cookies ni sesión fuera del alcance acordado.
- El frontend continúa provisional hasta las Partes 4 y 5.
- La instancia habitual de XAMPP y los secretos privados no se modifican.

## [0.2.0] - 2026-10-05

### Agregado

- Modelo relacional en 3FN con users, roles y login_logs.
- Scripts de esquema, seed bcrypt, cuenta SQL restringida y consultas didácticas.
- Diagrama Mermaid y explicación paso a paso de la normalización.
- Documentación de credenciales ficticias y copias privadas de SQL ignoradas por Git.
- Validación con 38 comprobaciones sobre MariaDB 10.4.32 en una instancia aislada.

### Decisiones

- El último acceso se calcula desde eventos exitosos para no duplicar fechas.
- Los scripts no sobrescriben tablas ni cuentas existentes.
- El provisionamiento rechaza contraseñas ausentes o placeholders conocidos.
- La base habitual de XAMPP y su cuenta real no se alteraron automáticamente.

## [0.1.0] - 2026-10-05

### Agregado

- Proyecto independiente con Expo SDK 57, TypeScript estricto y Expo Router.
- Estructura Atomic Design reservada para las siguientes partes.
- Dependencias del backend Express y MySQL/MariaDB.
- ESLint, Prettier, variables de ejemplo y exclusión de secretos.
- Pantalla y endpoint de salud provisionales para comprobar el setup.

La versión 0.1.0 no incluye todavía acceso de usuarios.
