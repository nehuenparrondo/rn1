# Hosting académico — Render + Aiven

**Estado:** código preparado, pero sin servicios/URL pública verificados todavía.
El usuario confirmó que creó/inició sesión en ambas cuentas. Las sesiones dentro
del navegador de Codex siguen pendientes de acceso; no se infiere conexión del plugin.
No se contrató ningún plan ni se ingresó una tarjeta.

## Qué se publica

- Render Static Site: exportación web de Expo; carpeta dist.
- Render Web Service Free: API Express con Node 24.
- Aiven MySQL Free: datos persistentes, separados de XAMPP.
- GitHub rn1: código público, sin .env ni credenciales.

Publicar web no instala la app en App Store. El iPhone puede seguir usando Expo Go,
con EXPO_PUBLIC_API_URL apuntando a la futura API HTTPS y un nuevo bundle.

## 1. Aiven: base gratuita

1. En Services, crear **MySQL**, seleccionar **Free**, no un trial de plan pago.
2. Revisar el resumen: si pide tarjeta o precio mayor a cero, detenerse.
3. Elegir una región próxima a la API y esperar a que el servicio esté disponible.
4. Obtener host, puerto y certificado CA desde la conexión del servicio.
5. Importar schema.sql en una base nueva np_user_access, sin tocar otras bases.
6. Para esta demo, seed.sql contiene solo usuarios ficticios; nunca usuarios reales.
7. Crear una cuenta SQL dedicada, np_login_app. No usar avnadmin como cuenta de la API.
8. Verificar el Host y permisos que asigna el proveedor; aplicar permisos mínimos:
   SELECT de las columnas consultadas, INSERT limitado en users y login_logs.
   No ejecutar create_app_user.sql local sin adaptarlo: usa Host 127.0.0.1.
9. Guardar sus credenciales solamente en configuración privada de Render.

La provisión en Aiven no se declara comprobada hasta ejecutar consultas contra
ese servicio. Si el plan administrado impide algún privilegio, revisar su política;
no usar el administrador como una solución rápida.

## 2. Render: API

render.yaml incluye una plantilla con plan free explícito para evitar el plan pago
por defecto. Se puede usar un Blueprint o crear los dos servicios manualmente.

| Campo              | API                                   |
| ------------------ | ------------------------------------- |
| Repositorio / rama | nehuenparrondo/rn1 / main             |
| Tipo / plan        | Web Service / Free                    |
| Runtime / Node     | Node / 24.15.0                        |
| Root directory     | backend                               |
| Build              | npm ci --include=dev && npm run build |
| Start              | npm start                             |
| Health check       | /api/ready                            |

Variables privadas del panel: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_SSL_CA.
DB_NAME=np_user_access, DB_SSL=true, HOST=0.0.0.0, NODE_ENV=production,
TRUST_PROXY_HOPS=1 y CORS_ORIGINS con el origen web real, sin rutas ni comodines.
Render suministra PORT. DB_SSL_CA acepta PEM multilínea o saltos literales \\n.

TLS comprueba CA y nombre del servidor. No usar rejectUnauthorized=false.
TRUST_PROXY_HOPS=1 solo detrás de la entrada administrada de Render, nunca para
confiar en headers arbitrarios en una API expuesta directamente.
En XAMPP se conservan DB_SSL=false y TRUST_PROXY_HOPS=0 por defecto.

GET /api/health mantiene liveness HTTP. GET /api/ready verifica conexión SQL:
200 disponible o 503 genérico. Una URL de health 200 no basta para aprobar login.

## 3. Render: web

| Campo               | Web                                       |
| ------------------- | ----------------------------------------- |
| Tipo                | Static Site                               |
| Root directory      | raíz del repositorio                      |
| Build               | npm ci --include=dev && npm run build:web |
| Publish directory   | dist                                      |
| EXPO_PUBLIC_API_URL | origen HTTPS real de la API, sin /api     |

La URL se incorpora durante la exportación: cambiarla requiere reconstruir web.
Agregar el origen web exacto a CORS_ORIGINS de la API. No hay claves SQL en frontend.
Las rutas /, /register y /welcome se exportan estáticamente; no se inventa una URL
onrender.com antes de que Render la asigne.

## 4. Aprobación de la publicación

- /api/ready responde 200 desde Internet con la base remota.
- Registro ficticio crea un usuario student y el hash verifica con bcrypt.
- Email duplicado devuelve 409 y no cambia la cuenta.
- Login de la cuenta nueva permite bienvenida y logout.
- CORS acepta el web propio y rechaza un origen externo.
- Límite de solicitudes, TLS, campos privados y datos públicos revisados.
- Tema y formulario se prueban en web; registro/login se confirman también en iPhone.
- Registrar URLs y fecha reales en operations.md solo tras comprobar todo.

## Límites gratuitos

Render Free suspende la API tras 15 minutos sin tráfico; despertar puede tardar
aproximadamente un minuto. El timeout de la app es 10 segundos: abrir /api/ready,
esperar disponibilidad y reintentar durante una demostración. No crear un mecanismo
de tráfico artificial para mantenerlo despierto.
Las cuotas de transferencia/compilación pueden suspender servicios si no hay tarjeta.
Aiven Free no requiere tarjeta y tiene almacenamiento/conexiones limitados.
No prometer disponibilidad de producción ni ausencia de avisos transitivos.

Fuentes oficiales:
[Render Free](https://render.com/docs/free),
[Blueprint](https://render.com/docs/blueprint-spec),
[Variables](https://render.com/docs/configure-environment-variables),
[Aiven Free](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier),
[Certificados Aiven](https://aiven.io/docs/platform/concepts/tls-ssl-certificates).
