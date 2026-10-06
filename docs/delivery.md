# Parte 6 — Documentación y entrega

> Registro histórico del cierre documental 0.5.1. Las acciones posteriores,
> incluida la configuración real de XAMPP, están en [operations.md](operations.md).

Se cierra la documentación sobre el proyecto local existente, sin cambiar la API,
el diseño ni Expo SDK 57. Frontend **0.5.1**, backend **0.3.0**.
No se hicieron commits, ramas, publicación ni cambios en el XAMPP habitual.

## Árbol documental final, antes de los ejemplos

El árbol de código completo está en [README](../README.md).

```text
proyecto-3-acceso-usuarios/
├── README.md
├── CHANGELOG.md
└── docs/
    ├── database.md
    ├── backend.md
    ├── frontend-base.md
    ├── screens.md
    ├── components.md
    ├── git-guide.md
    ├── rubric.md
    ├── testing.md
    ├── defense.md
    ├── delivery.md
    └── screenshots/
        ├── login-final-oscuro.png
        ├── login-escritorio-claro.png
        ├── bienvenida-movil.png
        ├── bienvenida-escritorio-claro.png
        ├── login-cargando.png
        └── login-timeout.png
```

## Qué leer para entregar

| Documento                         | Uso                                                   |
| --------------------------------- | ----------------------------------------------------- |
| [README](../README.md)            | Instalar, preparar XAMPP y ejecutar frontend/backend. |
| [CHANGELOG](../CHANGELOG.md)      | Evolución local; no sustituye historial Git.          |
| [Base de datos](database.md)      | Normalización, Mermaid, importación y permisos.       |
| [API](backend.md)                 | Contratos, seguridad y ejemplos curl/Postman.         |
| [Frontend base](frontend-base.md) | Bases y decisiones de la Parte 4.                     |
| [Pantallas](screens.md)           | Flujo, props y pruebas reales de la Parte 5.          |
| [Componentes](components.md)      | Props, hooks y responsabilidades actuales.            |
| [Git](git-guide.md)               | Commits, ramas y publicación manual revisada.         |
| [Rúbrica](rubric.md)              | Cada requisito con evidencia y pendientes.            |
| [Pruebas](testing.md)             | Casos repetibles y registro de resultados.            |
| [Defensa](defense.md)             | Presentación breve, demo y preguntas probables.       |

Partes 2–5 conservan el contexto histórico de su etapa. Para estado actual
consultar README, rubric y testing.

## Capturas incluidas

Capturas reales de la interfaz **web** de la Parte 5 con datos ficticios.
Las que parecen móviles son viewports, no screenshots de un iPhone real.
El login exitoso usó Express y MariaDB aislada, con fecha del evento de prueba.

| Archivo                         | Qué muestra                                    |
| ------------------------------- | ---------------------------------------------- |
| login-final-oscuro.png          | Formulario vacío y tema violeta/fucsia oscuro. |
| login-escritorio-claro.png      | Login en dos columnas y tema claro, 1440×900.  |
| bienvenida-movil.png            | Estudiante desde SQL en viewport 390×844.      |
| bienvenida-escritorio-claro.png | Administrador y layout escritorio claro.       |
| login-cargando.png              | Spinner y datos ficticios, contraseña oculta.  |
| login-timeout.png               | Timeout y controles recuperados.               |

No incluyen DB_PASSWORD, token ni panel administrativo. Ampliar con capturas
nativas cuando se ejecuten esos casos; no editar evidencia para aparentar éxito.

## Validación técnica de cierre

Se registran los resultados de la Parte 6 después de ejecutar los comandos.
Las comprobaciones históricas están separadas en testing.md.

- [x] Frontend: lint, TypeScript y Prettier finales.
- [x] Backend: lint, TypeScript, formato y compilación.
- [x] Dependencias Expo compatibles; expo-doctor: 21/21 comprobaciones.
- [x] Exportación web, Android e iOS final.
- [x] 41 enlaces locales de 12 Markdown válidos; seis capturas incluidas.
- [x] Versiones frontend/app/lockfile coherentes: 0.5.1.
- [x] 62 archivos TypeScript propios con comentario inicial y sin any.

Revisión de dependencias con npm audit: backend **0** vulnerabilidades reportadas;
frontend **29** (10 moderadas, 19 altas, 0 críticas) en el árbol de dependencias.
El resultado no garantiza ausencia de vulnerabilidades y los avisos no se
consideran resueltos. No se alteró el SDK ni se aplicó audit fix --force.

El ZIP de entrega se construye con una lista permitida de código, documentación,
assets, configuraciones públicas, lockfiles y SQL público. Excluye .env,
*.local.sql, .git, node_modules, dist y datos de las instancias de prueba.
Las variables públicas de ejemplo no son secretos. Se verifica la lista interna
del archivo al empaquetarlo.

La auditoría se informa separadamente, sin downgrades ni fixes forzados del SDK.
Estos comandos no configuran una contraseña SQL privada.

## Pendientes para una entrega verificada

1. Importar scripts en XAMPP habitual y crear cuenta SQL limitada con contraseña
   privada; editar backend/.env localmente, sin publicarla.
2. Confirmar login desde esa API; health solo comprueba Express.
3. Probar proyecto 3 en iPhone/Android: teclado, safe areas, rotación, accesibilidad,
   tema y scroll en ambas pantallas; registrar resultados.
4. Revisar avisos de dependencias compatibles antes de publicar.
5. Crear historial Git honesto y remoto; publicar sin secretos.
6. Clonar en otra carpeta y repetir instalación/documentación.
7. Si el docente exige URL pública, planificar un despliegue separado.

## Checklist final de archivos

- [x] Proyecto propio y dos package.json/lockfiles.
- [x] Rutas app/; src/ con Atomic Design, pages, hooks, context, services y tipos.
- [x] Backend organizado y schema/seed/permisos/queries públicos.
- [x] .env.example en ambos lados y .gitignore para secretos/generados.
- [x] README, CHANGELOG, guías, rúbrica y plan de pruebas.
- [x] Capturas web reales relativas, utilizables en GitHub.
- [ ] XAMPP habitual preparado y verificado.
- [ ] Android/iOS ejecutados con Expo Go para este proyecto.
- [ ] Resultados nativos y clon limpio registrados.
- [ ] Commits, ramas, remoto y URL GitHub reales.
- [ ] URL de hosting si es requisito adicional.
- [ ] Versión 1.0.0/tag/release solo cuando corresponda.

## Repositorio, QR y hosting no son lo mismo

GitHub entrega código. El QR local abre Metro mientras la PC/API están disponibles.
Una web publicada necesita servir el export web y alcanzar una API pública HTTPS,
que a su vez acceda a una BD privada. Un servicio de BD no publica por sí solo
React Native web ni el proceso Express.

No se realizó hosting. XAMPP es para desarrollo: no abrir MySQL/phpMyAdmin a Internet.
Referencia: [XAMPP](https://www.apachefriends.org/faq_windows.html).
El frontend nunca debe conectarse directamente a una base remota.

## Límites y mejoras futuras

- Sin registro, recuperación de contraseña o dashboard ficticio.
- Sin JWT/cookies/sesión de servidor: usuario en memoria.
- Redirección de UI y rol mostrado no autorizan operaciones sensibles.
- Futuro: autorización verificable, HTTPS, JWT y SecureStore cuando corresponda;
  retención de logs, gestión de usuarios y limiter compartido.
- MariaDB aislada comprobada; MySQL8/WAMP/LAMP requieren prueba propia.
- Esta revisión conserva dependencias y comportamiento.

## ¿Qué rúbrica cubre esto?

- [x] Documentación, capturas, guía Git y versionado.
- [x] Checklist, plan de pruebas y defensa oral.
- [x] Alcance/riesgos explicados sin inventar resultados.
- [ ] Dispositivos, entorno habitual, GitHub y eventual publicación.

Las seis partes documentales terminan aquí; los pendientes operativos no se
marcan completos por haber escrito las guías.
