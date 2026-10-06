# Plan de pruebas y resultados

Fecha del registro: **5 de octubre de 2026**. No confundir resultado observado,
resultado esperado y prueba pendiente. El navegador con un viewport de iPhone
no ejecuta iOS ni valida el teclado de Expo Go.

## Preparación repetible

1. Seguir [README](../README.md) y [database.md](database.md). Importar solo en tu
   instancia de desarrollo; no borrar tablas existentes para repetir una prueba.
2. Configurar la cuenta SQL privada y backend/.env. El placeholder actual impide
   arrancar: es un rechazo de seguridad esperado, no un fallo del formulario.
3. Arrancar la API en 3000 y Metro en 8083 en terminales distintas.
4. Comprobar health, luego un login HTTP. Health por sí solo no comprueba MySQL.
5. Revisar EXPO_PUBLIC_API_URL, CORS web, IP LAN y firewall privado.
6. Usar únicamente cuentas ficticias; no incluir contraseñas privadas en evidencia.

Hay un límite de **10 POST por IP cada 15 minutos**, también en logins correctos.
Distribuir los casos entre ventanas o reiniciar únicamente tu API local.
No cambiar la protección del código entregable para evitar un 429.

## Matriz funcional

Estado W = observado en web con Express y MariaDB aislada.
Estado H = observado en HTTP real aislado; no necesariamente mediante la UI.
Estado S = comprobación del servicio con servidor HTTP de prueba.
Todos los casos de Expo Go siguen pendientes para el **proyecto 3**.

| ID  | Acción / datos                                    | Resultado esperado                                              | Evidencia existente           |
| --- | ------------------------------------------------- | --------------------------------------------------------------- | ----------------------------- |
| F01 | student@np.test / StudentDemo!2026                | Bienvenida con id 2, nombre, rol student y fecha SQL real.      | W, H                          |
| F02 | admin@np.test / AdminDemo!2026                    | Datos del administrador id 1, sin datos inventados.             | W, H                          |
| F03 | missing@np.test / StudentDemo!2026                | 401 y Credenciales incorrectas.                                 | W, H                          |
| F04 | Email válido y contraseña errónea de largo válido | El mismo mensaje 401 de F03.                                    | W, H                          |
| F05 | inactive@np.test / InactiveDemo!2026              | 401 aunque la contraseña sea correcta.                          | W, H                          |
| F06 | Enviar ambos campos vacíos                        | Mensajes por campo; cliente no envía. HTTP directo: 400.        | W, H                          |
| F07 | Email sin arroba                                  | Mensaje bajo email, no navegar.                                 | W, H                          |
| F08 | Contraseña de 3 caracteres                        | Mensaje bajo password, no navegar.                              | W, H                          |
| F09 | Mostrar y ocultar password                        | Alternar visibilidad y etiqueta accesible; no cambiar el valor. | W                             |
| F10 | Enter en email y luego password                   | Foco al segundo campo, luego envío.                             | W; Next/Done nativo pendiente |
| F11 | Respuesta demorada                                | Spinner, inputs/botón bloqueados, sin doble solicitud.          | W                             |
| F12 | Cerrar sesión                                     | Limpiar usuario, volver a / e inputs vacíos.                    | W                             |
| F13 | Abrir /welcome sin login y con parámetros falsos  | Redirigir a /; no confiar en name/role de la URL.               | W                             |
| F14 | Recargar bienvenida                               | Perder usuario en memoria, volver a login; conservar tema.      | W                             |
| F15 | Detener SOLO Express de desarrollo                | Error de red, no crear usuario y desbloquear controles.         | W, S                          |
| F16 | Detener SOLO MySQL de desarrollo                  | Login 500 genérico; health continúa 200.                        | W, H                          |
| F17 | Conexión HTTP aceptada sin responder              | Timeout a los 10 s, mensaje claro y controles habilitados.      | W, S                          |
| F18 | Exceder límite por IP                             | 429, mensaje claro y Retry-After; no ejecutar SQL.              | H, S                          |
| F19 | Restablecer API/BD tras falla                     | Reintentar permite login real, sin reiniciar toda la interfaz.  | W                             |

F15/F16 afectan procesos propios de desarrollo. No detener servicios compartidos
o una base usada por otra aplicación. Restaurarlos al terminar.
F17 se observó con un proxy temporal de prueba que retenía la respuesta;
no existe un botón de timeout ni un proxy obligatorio en el proyecto entregado.

## UI, accesibilidad y responsive

| ID  | Acción                                                 | Resultado esperado                                               | Estado                                                 |
| --- | ------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------ |
| U01 | Alternar tema en login y bienvenida                    | Todos los textos/superficies/controles cambian.                  | Web observado                                          |
| U02 | Elegir tema y recargar                                 | Conservar preferencia, no usuario/password.                      | Web observado                                          |
| U03 | Instalación sin preferencia                            | Seguir tema del sistema hasta elección manual.                   | Implementado; comprobar en Expo Go                     |
| U04 | Scroll >240 con contenido desplazable en ambas páginas | Aparece flecha arriba del tema; fade y sin superposición.        | Web observado                                          |
| U05 | Tocar Volver arriba                                    | Volver al inicio; flecha desaparece.                             | Web observado                                          |
| U06 | Inicio o contenido sin scroll                          | Flecha no visible ni interactiva.                                | Web observado                                          |
| U07 | 390×844 móvil y 820×1180 tablet                        | Contenido flexible, sin desbordamiento horizontal.               | Viewports web observados                               |
| U08 | 1440×900 escritorio                                    | Login dividido; bienvenida en columnas.                          | Web observado                                          |
| U09 | 844×390 horizontal                                     | Contenido desplazable y formulario alcanzable.                   | Web observado; rotación nativa pendiente               |
| U10 | Teclado nativo, Next/Done y safe areas                 | Campos/botón alcanzables; flotantes ocultos mientras se escribe. | Pendiente iOS/Android                                  |
| U11 | VoiceOver/TalkBack, texto grande, teclado web          | Nombres/roles, errores legibles y foco lógico.                   | Atributos implementados; evaluación asistiva pendiente |
| U12 | Movimiento reducido del sistema                        | Entrada/transición sin fade y scroll no animado.                 | Implementado; verificar por plataforma                 |

Los colores se comprobaron matemáticamente en las 53 verificaciones del servicio/
utilidades; esto no constituye una certificación completa de accesibilidad.
Con texto grande revisar ambas pantallas, no solo los botones.

## API y SQL

Ejemplos curl/Postman reproducibles en [backend.md](backend.md).
Usar HTTP directo para casos que el cliente bloquea:

- POST JSON válido: 200 con campos públicos y fecha UTC; nunca password/hash.
- Email/password vacíos o tipos inválidos, arrays, null, extras y query params: 400.
- Formato no admitido: 415; cuerpo >4 KB: 413; método incorrecto: 405.
- Origin permitido: cabecera exacta; origen ajeno: 403; preflight: 204.
- SQL con email que contiene comillas: se interpreta como dato parametrizado.
- Cuenta SQL dedicada: SELECT por columnas e INSERT de logs; sin UPDATE/DELETE/DDL.
- Intentos comparados: registro real; validación/429 no agregan eventos.
- Email inexistente: user_id NULL. Cuenta conocida: FK a users.
- Con MySQL apagado: 500 sin nombres de tablas, query, stack ni secretos.

Revisar consultas de logs solo con la cuenta adecuada; no publicar attempted_email
de usuarios reales. La guía no solicita usar root en la API.

## Registro de validación existente

| Etapa   | Ejecución observada                                                                | Límite de la evidencia                                                  |
| ------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Parte 2 | 38 comprobaciones con MariaDB 10.4.32 aislada, SQL y hashes bcrypt.                | No prueba importación en XAMPP habitual ni MySQL 8 separado.            |
| Parte 3 | 46 comprobaciones HTTP reales, SQL, errores, CORS y rate limit.                    | Contador reducido solo en proceso aislado para el caso 429.             |
| Parte 4 | 53 comprobaciones de utilidades/servicio HTTP, Unicode, JSON, contraste y timeout. | No una suite de interfaz nativa; se repitieron en Parte 5.              |
| Parte 5 | Casos web W de esta matriz, login real y capturas.                                 | SQL aislado; límite ampliado solo en proceso de prueba para revisar UI. |
| Parte 6 | Revisión documental, formato, lint, tipos y exportación final.                     | Resultados detallados en delivery.md al cerrar la parte.                |

No sumar esos números como si fueran casos únicos: las regresiones se repitieron.
Los scripts temporales de comprobación quedaron fuera del repositorio y del ZIP;
no hay npm test ni una suite permanente. El plan manual sí es reproducible.
Los procesos aislados de la Parte 5 se detuvieron al terminar.

### Cierre operativo posterior

- XAMPP habitual: scripts públicos importados en una base nueva, con cuenta limitada.
- Health y login por LAN: respuestas 200; bienvenida y logout observados en web.
- Expo Doctor: 21/21 comprobaciones correctas tras el override acotado de uuid.
- Backend: lint, tipos, formato y compilación correctos.
- Clone limpio publicado: npm ci, check de ambos paquetes y exportación web/Android/iOS.
- API compilada del clone contra XAMPP habitual: health 200, validación 400,
  credenciales incorrectas 401 y credenciales ficticias correctas 200.
- La API temporal del clone se detuvo; no se copió configuración privada a esa carpeta.
- Las verificaciones nativas y de publicación se registran en
  [operations.md](operations.md), sin dar por aprobados dispositivos no probados.

Comandos de validación desde la raíz:

```powershell
npm run check
npm --prefix backend run check
npm --prefix backend run build
npx expo install --check
npx expo-doctor
npm run build:all
npm audit
npm --prefix backend audit
```

Auditoría de dependencias y exportación son comprobaciones distintas. No usar
npm audit fix --force para hacer desaparecer avisos si rompe Expo.

## Checklist de pruebas en el celular

- [ ] Preparar XAMPP habitual y confirmar login HTTP real.
- [ ] Abrir /api/health desde el navegador del celular con IP LAN.
- [ ] Abrir el proyecto 3 desde su QR de Metro 8083; no el QR de proyectos 1/2.
- [ ] Repetir F01–F19 aplicables en iPhone con Expo Go.
- [ ] Repetir los mismos casos en Android con Expo Go.
- [ ] Probar teclado, safe areas, rotación y texto grande en ambas pantallas.
- [ ] Revisar VoiceOver/TalkBack y movimiento reducido.
- [ ] Confirmar persistencia del tema tras cerrar/reabrir la app.
- [ ] Guardar capturas de datos ficticios y resultados, sin secretos.

Windows no ejecuta el simulador oficial de iOS; un iPhone físico permite probar
con Expo Go. Android puede probarse con dispositivo o emulador.
Exportar bundles Android/iOS no marca ninguna casilla de ejecución nativa.

## Plantilla para registrar resultados nuevos

| Fecha                 | Caso              | Plataforma / versión            | Esperado  | Observado              | Estado                       | Evidencia      |
| --------------------- | ----------------- | ------------------------------- | --------- | ---------------------- | ---------------------------- | -------------- |
| Completar al ejecutar | ID de esta matriz | Modelo, OS, Expo Go o navegador | Describir | Describir sin secretos | Aprobado / falló / bloqueado | Captura o nota |

No cambiar un pendiente a aprobado solo porque el código parece correcto.
