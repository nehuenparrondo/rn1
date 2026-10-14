# Acceso de usuarios · React Native + Node.js

El proyecto de login tiene **dos aplicaciones independientes**: React Native/Expo
en `frontend/` y Node.js/Express en `backend/`. Cada una tiene su propio `src/`,
`package.json`, `package-lock.json`, TypeScript, ESLint, dependencias y entorno.
La raíz solo ofrece comandos de comodidad; no es una tercera aplicación.

## Estructura actual

```text
rn1/
├── frontend/
│   ├── app/                 # Rutas de Expo Router: login, registro y bienvenida
│   ├── src/                 # Código exclusivo de React Native
│   │   ├── components/      # Átomos, moléculas y organismos
│   │   ├── pages/           # Pantallas compuestas
│   │   ├── context/         # Usuario público en memoria y tema
│   │   ├── hooks/           # Estado y comportamiento de interfaz
│   │   ├── services/        # Solicitudes HTTP a la API
│   │   ├── constants/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── assets/
│   ├── .env.example         # Solo URL pública de la API
│   ├── app.json
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
├── backend/
│   ├── src/                 # Código exclusivo de Node.js
│   │   ├── server.ts        # Abre el puerto y gestiona el cierre
│   │   ├── app.ts           # Compone Express y monta las rutas
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── types/
│   │   └── utils/
│   ├── database/            # SQL; no ejecutar de nuevo sobre la base existente
│   ├── examples/            # Cuerpos JSON de demostración
│   ├── .env.example         # Plantilla sin secretos reales
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
├── docs/                    # Explicación del código y guías de trabajo
├── render.yaml              # Plantilla de despliegue con raíces separadas
└── package.json             # Atajos hacia ambas aplicaciones
```

`frontend/app/` se mantiene fuera de `frontend/src/` porque contiene las rutas
de Expo Router. Todo sigue dentro del proyecto frontend; no comparte código con
`backend/src/`. React Native no importa Express, mysql2 ni archivos del servidor.
El backend está escrito en TypeScript y se ejecuta con **Node.js**, no con React Native.

## Ejecutar en esta computadora

La base existente se llama `np_user_access`. **No volver a importar schema ni seed**:
la reorganización no necesita modificar usuarios, tablas ni permisos.

1. Iniciar **MySQL** en XAMPP si no está funcionando. Apache solo es necesario para
   administrar la base mediante [phpMyAdmin](http://localhost/phpmyadmin/).
2. Abrir una terminal de VS Code en `rn1/backend` y ejecutar:

```powershell
npm.cmd run dev
```

3. Abrir otra terminal en `rn1/frontend` y ejecutar:

```powershell
npm.cmd start -- --go --web --port 8083 --max-workers 1
```

4. Abrir [el login](http://localhost:8083/). Mantener las dos terminales abiertas.
   El QR de Expo es para **Expo Go**, no para un development build.

Se recomienda **Node.js 24**; el backend exige Node >=24. En esta PC hay Node 22
instalado en el sistema y Node 24 disponible en el runtime local de Codex.
Los accesos `iniciar-proyecto-3-api.cmd` y `iniciar-proyecto-3-web.cmd` entregados
en esta conversación seleccionan ese Node 24. Para usarlo manualmente en cada terminal:

```powershell
$env:Path = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:Path"
$env:NODE_OPTIONS = "--use-system-ca"
node --version
```

Esto solo afecta la terminal actual y conserva la validación TLS. No cambia
políticas de PowerShell ni protecciones de la escuela. Usar `npm.cmd` si se bloquea
`npm.ps1`. Si falta Node 24 o autorización de red, pedir ayuda al profesor.

## Instalación limpia en otra computadora

Instalar Node 24 autorizado y ejecutar desde la raíz:

```powershell
npm.cmd --prefix frontend ci
npm.cmd --prefix backend ci
```

También existe el atajo `npm.cmd run install:all`. No copiar `node_modules` de
otra PC. Las versiones fijadas se conservan en los dos lockfiles.

Crear `frontend/.env` a partir de `frontend/.env.example`, y `backend/.env` a
partir de `backend/.env.example`, **solo si todavía no existen**.
Preparar una base nueva siguiendo [la guía de base de datos](docs/database.md).
Los archivos locales de esta PC ya existen y están excluidos de Git.

## Comunicación entre ambos proyectos

```text
React Native → POST HTTP/JSON → Express (Node.js) → mysql2 → MySQL/MariaDB
React Native ← JSON público  ← controlador      ← resultado SQL
```

- Login: `POST /api/auth/login`, cuerpo `{ "email": "...", "password": "..." }`.
- Registro: `POST /api/auth/register`, cuerpo con `name`, `email` y `password`.
- Disponibilidad HTTP: `GET /api/health`.
- Disponibilidad de SQL: `GET /api/ready`.

La solicitud real está en `frontend/src/services/authService.ts`, dentro de
`sendAuthRequest`. Las rutas están en `backend/src/routes/authRoutes.ts`.
El controlador verifica bcrypt y devuelve JSON; el modelo ejecuta SQL parametrizado.

Tras un login correcto, `AuthContext` conserva el usuario público en memoria.
`frontend/app/welcome.tsx` se lo pasa a `WelcomePage` mediante
`<WelcomePage user={publicUser} onLogout={handleLogout} />`.
**No hay JWT ni sesión persistente de servidor**: es un ejercicio de verificación
de credenciales, no un sistema completo de autorización de recursos privados.

## iPhone y configuración

`frontend/.env` contiene únicamente `EXPO_PUBLIC_API_URL`, el origen HTTP/HTTPS
de la API, **sin /api**. Para iPhone debe ser la IP actual de esta PC, no localhost.
Las variables `EXPO_PUBLIC_*` son públicas: nunca colocar allí credenciales SQL.

`backend/.env` mantiene host, puerto 3000, CORS y credenciales privadas de la cuenta
SQL limitada. La API no utiliza root. El teléfono consulta la API, nunca MySQL.

Al cambiar de red, actualizar la URL pública, los orígenes exactos de CORS y
reiniciar ambos procesos. Escanear el QR nuevo. Si la escuela impide conexiones
entre equipos, pedir autorización; no desactivar el firewall ni abrir un túnel
sin permiso. Un túnel de Expo no publica por sí solo la API.

Cuenta ficticia del seed: `student@np.test` / `StudentDemo!2026`.
No es la cuenta privada de la base de datos.

## Verificar y compilar

Desde cada proyecto, `npm.cmd run check` ejecuta lint, TypeScript y formato.
Desde la raíz, `npm.cmd run check` comprueba ambos proyectos y la documentación.

```powershell
npm.cmd --prefix backend run build
npm.cmd --prefix backend start
npm.cmd --prefix frontend run build:web
```

La compilación del backend genera `backend/dist/server.js`; su comando start
debe ejecutarse con el directorio de trabajo en `backend/` para cargar su .env.
La web exportada queda en `frontend/dist/`. No ejecutar dev y start a la vez
sobre el mismo puerto.

## Documentación del código

- [Recorrido completo e índice de cada archivo](docs/codigo.md).
- [Frontend independiente](frontend/README.md).
- [Backend independiente y contrato HTTP](backend/README.md).
- [Migración de carpetas y comprobaciones](docs/separacion.md).
- Guías de diseño y etapas anteriores: [componentes](docs/components.md),
  [base de datos](docs/database.md), [seguridad](docs/security.md),
  [pruebas](docs/testing.md) y [defensa](docs/defense.md).

Las guías anteriores conservan notas históricas identificadas como tales.
Esta página y los README de frontend/backend describen la estructura actual.
El repositorio queda concentrado en el login. El proyecto 2 de componentes
nativos se retira también de GitHub por indicación expresa del usuario.
