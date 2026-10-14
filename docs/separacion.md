# Separación del frontend y backend

## Objetivo y alcance

El login del proyecto 3 queda organizado en dos aplicaciones independientes:

- React Native/Expo: `frontend/`, con `frontend/src/`.
- Node.js/Express: `backend/`, con `backend/src/`.

No se convirtió el backend a React Native ni se cambió su lenguaje de ejecución:
continúa usando Node 24, con TypeScript compilable a JavaScript.
El proyecto 2 se retira del repositorio por indicación expresa del usuario
durante la revisión de limpieza y publicación. No se inicia como parte del login.

## Mapa de cambios

| Antes                                  | Ahora                                          |
| -------------------------------------- | ---------------------------------------------- |
| `src/` en raíz                         | `frontend/src/`                                |
| `app/` en raíz                         | `frontend/app/`                                |
| `assets/` en raíz                      | `frontend/assets/`                             |
| Configuración Expo y paquetes de raíz  | Configuración y paquetes dentro de `frontend/` |
| `.env` público en raíz                 | `frontend/.env`                                |
| `backend/server.ts` y `backend/app.ts` | `backend/src/server.ts` y `backend/src/app.ts` |
| Carpetas de código dentro de backend   | Las mismas carpetas dentro de `backend/src/`   |
| `backend/.env`, SQL y paquetes         | Permanecen en backend, fuera de src            |
| Raíz usada como frontend               | Raíz solo con atajos y documentación           |

Las importaciones internas siguen siendo relativas en el backend y mediante
`@/*` o rutas relativas en el frontend. No hay importaciones cruzadas.
Los paquetes de cada aplicación se resuelven desde su propio directorio.
Las dependencias ya instaladas en esta misma PC se reubicaron, sin copiar
node_modules de otra computadora ni modificar sus versiones.

## Cambios operativos

- Backend dev: `tsx watch src/server.ts`.
- Backend TypeScript: `rootDir: src`, `include: src/**/*.ts`, salida dist.
- Backend producción: `node dist/server.js`, con cwd en backend.
- Frontend: ejecutar Expo desde frontend; iconos y alias conservan rutas internas.
- Render: frontend web ahora declara `rootDir: frontend`; API conserva backend.
- Los accesos de arranque entregados se ajustan a las nuevas carpetas.
- La raíz conserva `npm start -- ...` como atajo al frontend y
  `npm run check` como verificación de ambos proyectos.

## Archivos privados y datos

Se conserva `backend/.env` sin mostrar ni cambiar la contraseña SQL.
El entorno público se mueve a frontend; sigue excluido de Git.
No se reimporta schema/seed, no se recrean cuentas y no se borran tablas.
Las versiones de los lockfiles de aplicación se conservan.
La corrección se prepara para publicar en GitHub con autorización del usuario.
Esto no publica servicios ni la base de datos en un hosting.

## Verificar después de reorganizar

1. Desde la raíz: `npm.cmd run check`.
2. Compilar Node con `npm.cmd --prefix backend run build`.
3. Exportar web con `npm.cmd --prefix frontend run build:web`.
4. Iniciar MySQL, API y Expo en terminales separadas.
5. Comprobar `/api/health`, `/api/ready` y login con una cuenta ficticia.
6. Abrir la web en 8083, ingresar, comprobar bienvenida y cerrar sesión.
7. Confirmar físicamente en iPhone con el nuevo QR de la PC.
   Una prueba web no equivale a una prueba nativa.

## Resultados de esta corrección en la PC escolar

- `npm run check` desde la raíz: aprobado para frontend, backend y documentación.
- Compilación TypeScript de Node y exportación web de Expo: aprobadas.
- API HTTP y conexión SQL: disponibles; login ficticio real respondió correctamente.
- Web: ingreso del estudiante → bienvenida con datos públicos → cierre de sesión.
- Login y registro con cuerpos vacíos: HTTP 400, sin crear cuentas.
- Se compararon los 69 módulos contra el código anterior sin comentarios: el
  JavaScript generado es equivalente. Las dependencias y ambos lockfiles de
  aplicación se conservaron sin cambios.
- Se comprobaron los enlaces de las nuevas guías y la exclusión de ambos .env.
- API y Expo se dejaron encendidos en 3000 y 8083; el QR anuncia runtime Expo Go.
- No se afirma una prueba física nueva en iPhone/Android ni una publicación.

No hay suite de tests automáticos configurada en estos paquetes: check comprueba
lint, tipos y formato. La comprobación HTTP y el recorrido web son adicionales.

## Limpieza previa a publicar

Se retiraron las carpetas antiguas vacías y la referencia de formato al proyecto 2.
El icono de splash sin referencias y la caché antigua de Expo de la raíz se
apartaron fuera del repositorio como respaldo local. Los resultados de compilación
son regenerables y no se versionan.

Se conservan las dependencias locales necesarias para ejecutar la aplicación,
las cachés del servidor activo y ambos .env privados, todos excluidos de Git.
Los SQL, ejemplos JSON, capturas y guías se conservan porque documentan o permiten
reproducir el trabajo. El proyecto 2 se elimina de GitHub con confirmación del usuario.
