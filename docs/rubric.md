# Checklist de la rúbrica

> Matriz del cierre documental. Estado operativo posterior actualizado en
> [operations.md](operations.md); no confundir pendientes históricos con actuales.

Evaluación al cerrar la Parte 6. **[x]** significa implementado/documentado con
la evidencia indicada; **[ ]** significa pendiente o parcialmente verificado.
No marcar ejecución nativa a partir de una exportación ni GitHub a partir de .git.

## 1. Funcionalidad

| Estado | Requisito                                  | Evidencia / pendiente                                                                                           |
| ------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| [x]    | Login → API → bienvenida                   | LoginForm/authService/authController/rutas; flujo web con Express/SQL real aislado.                             |
| [x]    | Datos del usuario por props                | app/welcome.tsx valida el estado y pasa WelcomePageProps a la vista.                                            |
| [ ]    | Sin errores/warnings en web, Android e iOS | Web y exportación correctos; falta ejecución del proyecto 3 en Expo Go Android/iOS.                             |
| [x]    | URL configurable y conectividad explicada  | apiConfig, .env.example y README: localhost, 10.0.2.2, LAN y firewall.                                          |
| [ ]    | Entorno habitual XAMPP funcionando         | MariaDB aislada comprobada; falta importar y configurar secreto privado habitual.                               |
| [x]    | Responsive                                 | useWindowDimensions, 768/1100, maxWidth y flexbox; viewports web móvil/tablet/escritorio/horizontal observados. |
| [x]    | Escalabilidad/modularidad                  | Rutas finas, pages, hooks, services y capas backend; componentes sin SQL.                                       |
| [x]    | Atomic Design                              | 8 atoms, 4 molecules, 2 organisms separados de páginas.                                                         |
| [x]    | Guía de Git y SemVer                       | git-guide.md: main/develop/feature, commits convencionales y CHANGELOG.                                         |
| [ ]    | Historial y remoto reales                  | .git local sin commits; no hay GitHub publicado ni ramas adicionales.                                           |
| [x]    | README completo                            | Setup, XAMPP, SQL, API, entorno, ejecución, librerías, capturas, problemas y contribución.                      |
| [x]    | Componentes documentados                   | components.md: contratos, hooks y responsabilidades.                                                            |

## 2. Código

| Estado | Requisito                               | Evidencia                                                                                    |
| ------ | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| [x]    | ESLint/Prettier en ambos proyectos      | Configuraciones y check; indentación de 2 espacios.                                          |
| [x]    | TypeScript estricto sin any propio      | Dos tsconfig strict, ESLint y typecheck.                                                     |
| [x]    | Props tipadas                           | User, LoginRequest, LoginResponse y WelcomePageProps.                                        |
| [x]    | Hooks y lógica/presentación separada    | useLoginForm/useAuth/useTheme y services; vistas sin SQL.                                    |
| [x]    | Tema/constantes centralizados           | styles/ y constants/; estructura en StyleSheet, variantes dinámicas acotadas.                |
| [x]    | Nombres ingleses, comentarios españoles | PascalCase/camelCase/UPPER_SNAKE_CASE; comentario de ruta y propósito.                       |
| [x]    | JSON sin comentarios inválidos          | El propósito de configuraciones/ejemplos se explica en documentación.                        |
| [x]    | Validación cliente                      | Vacíos, email, largo y bytes de password; mensajes bajo inputs y bordes de error/validación. |
| [x]    | Validación servidor                     | validateLogin y errorHandler; JSON uniforme y códigos correctos.                             |
| [x]    | Defensa oral                            | defense.md: recorrido del código, preguntas y respuestas.                                    |

## 3. Usabilidad

| Estado | Requisito                              | Evidencia / límite                                                                        |
| ------ | -------------------------------------- | ----------------------------------------------------------------------------------------- |
| [x]    | Tema global abajo a la derecha         | ThemeToggleButton en layout, useTheme y safe areas.                                       |
| [x]    | Tema del sistema y persistencia        | useColorScheme, ThemeContext, AsyncStorage solo para tema; persistencia web observada.    |
| [x]    | Scroll encima del tema                 | ScreenShell/useScrollToTop: offset >240 y contenido desplazable; espacio entre controles. |
| [x]    | Fade y retorno animado                 | Animated y scrollTo; movimiento reducido contemplado.                                     |
| [x]    | Scroll en ambas páginas                | Login en viewport reducido y bienvenida con contenido útil; oculto al inicio/sin scroll.  |
| [x]    | Tarjetas y accesos rápidos             | Cuenta, fecha real, información, cambio de tema y salida; sin acciones ficticias.         |
| [ ]    | Teclado/safe areas nativos comprobados | KeyboardAvoidingView y SafeAreaView implementados; falta prueba iOS/Android.              |
| [x]    | Jerarquía, spacing y diseño            | Tokens tipografía/espaciado/radio/sombra, paleta violeta/fucsia y ambos temas.            |
| [x]    | Loading/error/éxito                    | Spinner/bloqueo; 401/429/500/red/timeout según evidencias W/H/S de testing.md.            |
| [x]    | Logout y bienvenida sin datos          | signOut, router.replace, parseUser y Redirect; observado web.                             |
| [x]    | Visibilidad y Enter                    | TextField/LoginForm; foco/enviar observado web, Next/Done nativo pendiente.               |
| [x]    | Íconos/feedback/animaciones            | Ionicons, Pressable, EntranceView y Stack.                                                |
| [x]    | Base accesible                         | Etiquetas, roles, alerts, acciones >=44 puntos y contraste de tokens comprobado.          |
| [ ]    | Accesibilidad evaluada en dispositivos | VoiceOver/TalkBack, texto ampliado y movimiento reducido por plataforma pendientes.       |

## 4. Base de datos y backend

| Estado | Requisito                              | Evidencia / límite                                                       |
| ------ | -------------------------------------- | ------------------------------------------------------------------------ |
| [x]    | users/roles/login_logs y restricciones | schema.sql: PK/FK, índices, NOT NULL, UNIQUE, CHECK, utf8mb4/InnoDB.     |
| [x]    | 1FN/2FN/3FN paso a paso                | database.md: tabla sin normalizar, dependencias y resultado por etapa.   |
| [x]    | Diagrama ER                            | Mermaid con tres entidades y relaciones.                                 |
| [x]    | Seed y credenciales explicadas         | bcrypt coste 12, cuentas ficticias en README; sin logs fabricados.       |
| [x]    | JOIN/GROUP BY y consultas              | queries.sql y modelo del login.                                          |
| [x]    | POST login y GET health                | backend.md/examples; JSON público y errores 400/401/429/500.             |
| [x]    | SQL parametrizado                      | mysql2.execute con ?, valores separados.                                 |
| [x]    | bcrypt.compare y mensaje genérico      | authController; hash ficticio para inexistente, mismo 401 para inactiva. |
| [x]    | Menor privilegio con script            | create_app_user.sql: cuenta dedicada y permisos por columnas.            |
| [x]    | Secretos excluidos                     | .env.example/.gitignore; API rechaza root y password placeholder.        |
| [x]    | Seguridad por capas                    | CORS exacto, Helmet, rate limit y errores sin detalles internos.         |
| [x]    | Logs/fecha consistentes                | Transacción INSERT/MAX, UTC API y presentación local.                    |
| [x]    | Backend organizado y estricto          | config/models/controllers/routes/middlewares, types/constants/utils.     |
| [x]    | JWT/SecureStore como mejora            | Límites explícitos, no implementados fuera del alcance.                  |
| [ ]    | WAMP/LAMP/MySQL8 ejecutados            | Configurable y SQL común; solo se ejecutó MariaDB 10.4.32.               |
| [ ]    | Auditoría sin vulnerabilidades         | Avisos transitivos frontend; resultado actualizado en delivery.md.       |

## 5. Tiempos y entrega

| Estado | Requisito                     | Evidencia / pendiente                                                     |
| ------ | ----------------------------- | ------------------------------------------------------------------------- |
| [x]    | Etapas y checklist            | README y CHANGELOG, seis partes documentadas.                             |
| [x]    | Plan manual completo          | testing.md: pasos/datos/esperados, observado y pendientes por plataforma. |
| [x]    | Capturas y pruebas            | screenshots/: login/bienvenida/espera/error; capturas web identificadas.  |
| [x]    | Checklist final               | delivery.md, incluidos secretos, dispositivos y publicación.              |
| [ ]    | GitHub con README y capturas  | Archivos listos, sin publicación ni URL inventada.                        |
| [ ]    | Reproducción desde clon       | Falta clon limpio y configuración habitual privada.                       |
| [ ]    | Hosting si lo pide el docente | No desplegado; QR local y repositorio no son hosting de la app.           |

## ¿Qué rúbrica cubre la Parte 6?

- [x] Documentación final y catálogo de componentes.
- [x] Guía de commits/ramas/SemVer sin inventar historial.
- [x] Matriz de requisitos con evidencia y pendientes.
- [x] Plan de pruebas, capturas y límites.
- [x] Guía de defensa oral y checklist de entrega.
- [ ] XAMPP habitual, Expo Go real, GitHub y eventual hosting.

La documentación está completa. La entrega integral no se declara 100% verificada
ni lista para producción.
