# Frontend · React Native + Expo

Esta carpeta es una aplicación independiente. Tiene su propio `src/`, rutas
`app/`, assets, paquetes, lockfile, configuración y variables públicas.
No importa archivos del backend ni tiene acceso directo a MySQL.

## Instalación y ejecución

Requiere Node 24 recomendado y Expo Go compatible con SDK 57.
Desde **esta carpeta**:

```powershell
npm.cmd ci
npm.cmd start -- --go --web --port 8083 --max-workers 1
```

En esta PC las dependencias y `.env` ya están preparados; no hace falta repetir
la instalación para cada arranque. La API Node y MySQL deben estar encendidos.
Abrir [http://localhost:8083/](http://localhost:8083/).

## Configuración pública

Copiar `.env.example` a `.env` solamente si no existe. Configurar:

```dotenv
EXPO_PUBLIC_API_URL=http://IP_ACTUAL_DE_LA_PC:3000
```

Reemplazar el marcador por la IP real. En la PC puede usarse
`http://localhost:3000`, pero en el iPhone localhost significa el teléfono,
no la computadora. La URL es solo el origen, sin `/api`.
Expo incorpora este valor en el bundle; reiniciar después de cambiarlo.

**Nunca agregar DB_PASSWORD ni secretos a variables EXPO_PUBLIC\_*.**
Para certificados escolares confiados por Windows se utiliza
`NODE_OPTIONS=--use-system-ca`, sin desactivar TLS.

## Carpetas y responsabilidades

| Carpeta           | Responsabilidad                                               |
| ----------------- | ------------------------------------------------------------- |
| `app/`            | Expo Router: selección de ruta y paso de props a las páginas. |
| `src/pages/`      | Login, registro y bienvenida; composición responsive.         |
| `src/components/` | Atomic Design: controles, campos y formularios.               |
| `src/hooks/`      | Estado de formularios, accesibilidad, teclado y scroll.       |
| `src/context/`    | Usuario público en memoria y preferencia visual.              |
| `src/services/`   | URL pública y solicitudes HTTP/JSON.                          |
| `src/utils/`      | Validación, lectura segura de respuestas y presentación.      |
| `src/types/`      | Contratos de datos y props exclusivos del cliente.            |
| `src/styles/`     | Tokens de tema, colores, tipografía y medidas.                |
| `src/constants/`  | Límites, rutas y mensajes de interfaz.                        |

## Recorrido del login

`LoginForm` → `useLoginForm.submit` → `AuthContext.signIn` →
`loginRequest` → `sendAuthRequest` → `POST /api/auth/login`.

La API devuelve usuario público. Se valida el JSON, se guarda en contexto y la
ruta redirige a la bienvenida. `app/welcome.tsx` entrega `user` por props
a `src/pages/WelcomePage.tsx`. La contraseña nunca llega a esa página.

El registro usa `RegistrationForm` → `useRegistrationForm` →
`registrationRequest` → `POST /api/auth/register`. Tras el 201 se muestra
la confirmación y se puede volver al login; no hay ingreso automático.

El usuario solo vive en memoria. Recargar o cerrar la aplicación elimina ese
estado; el tema sí se persiste con AsyncStorage. No existe JWT ni sesión de servidor.

## Comandos

- `npm.cmd run check`: lint, tipos y formato.
- `npm.cmd run format`: formatea solamente este proyecto.
- `npm.cmd run build:web`: exporta a `frontend/dist/`.
- `npm.cmd run build:all`: exporta los bundles de las plataformas.
- `npm.cmd start -- --go`: QR para Expo Go; mantener la terminal abierta.

`package.json` define scripts y dependencias; el lockfile fija las versiones.
`app.json` describe Expo, rutas y assets; `tsconfig.json` aplica TypeScript
estricto y resuelve `@/*` a `src/*`.
`eslint.config.js` comprueba React Hooks y TypeScript.
`.prettierrc.json` y `.prettierignore` definen el formato y excluyen generados.

Ver [índice comentado de todos los módulos](../docs/codigo.md) y
[guía completa de arranque en la escuela](../README.md).
