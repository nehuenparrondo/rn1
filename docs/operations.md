# Cierre operativo

Registro de acciones posteriores a las seis partes documentales.
Frontend 0.5.2; backend 0.3.0. Fecha local: 5 de octubre de 2026.

## XAMPP habitual: configurado

- Se verificó datadir C:/xampp/mysql/data y puerto 3306 antes de provisionar.
- No existían np_user_access ni np_login_app; no se sobrescribieron tablas/cuentas.
- Se ejecutaron schema.sql, seed.sql y create_app_user.sql públicos.
- Cuenta SQL dedicada y password aleatorio privado en backend/.env, excluido de Git.
- Tres usuarios ficticios; login_logs inició vacío y recibió eventos HTTP reales.
- Privilegios limitados comprobados; el backend no usa root.
- El proceso MariaDB de esta ejecución está limitado a localhost.
- Health y login por la IP LAN de la PC correctos.
- Login → bienvenida → logout comprobados en navegador con la instancia habitual.

La cuenta administrativa local se utilizó solo para provisionar la base nueva.
No se cambiaron otras bases, cuentas administrativas, contraseñas existentes
o configuraciones globales de XAMPP. Apache no fue necesario para importar vía SQL.

## Inicio posterior

1. Iniciar MySQL desde XAMPP y comprobar que no se expone fuera de la PC.
2. Desde la raíz, npm --prefix backend run dev.
3. En otra terminal, npm start -- --lan --port 8083.
4. Revisar IP LAN y EXPO_PUBLIC_API_URL al cambiar de red.

Los archivos .env configurados quedan locales. Un clone/ZIP necesita sus propios
.env, base y cuenta dedicada: nunca copiar públicamente el password de esta PC.

## iPhone y Android

El usuario confirmó tener iPhone disponible. Se entregó QR para
exp://192.168.1.2:8083 y se solicitó comprobar health, ingreso, tema, scroll y salida.
Esto no sustituye el resultado: **prueba iPhone pendiente de confirmación**.
Android sigue pendiente; no hay un teléfono/emulador Android verificado aquí.
Los proyectos 1 y 2 probados anteriormente no validan este proyecto 3.

## GitHub

Destino autorizado por el usuario:
[nehuenparrondo/rn1](https://github.com/nehuenparrondo/rn1).
El repositorio remoto estaba vacío al inspeccionarlo.
El usuario autorizó primer commit, main/develop y publicación.
Publicación completada y verificada mediante push, git ls-remote, API de GitHub
y clone independiente. Las ramas main/develop apuntan al mismo código integrado.
Primer commit: 4d03904. Corrección de formato Windows: e0e6f09.
Sin commits históricos inventados, etiquetas ni release 1.0.0.

Se revisaron nombres y contenido de los 113 archivos iniciales antes de subirlos:
sin .env privado, SQL local, node_modules, dist, tokens ni password SQL de esta PC.
.env.example y las credenciales ficticias del seed sí son públicas por diseño.
La política .gitattributes conserva LF incluso con core.autocrlf de Windows.

## Reproducción desde clone: comprobada

Copia independiente obtenida de main, con Node 24.15.0 y npm 11.12.1:

- npm ci en frontend y backend, sin modificar lockfiles.
- npm run check en ambos: lint, TypeScript y formato correctos.
- npm run build en backend y npm run build:all: web/Android/iOS exportados.
- API compilada del clone iniciada temporalmente en localhost:3011.
- Health 200, campos vacíos 400, password incorrecto 401 y login ficticio correcto 200.
- Datos públicos y fecha SQL válida; sin password en respuesta.
- Configuración privada pasada únicamente al proceso, sin copiar .env al clone.
- Proceso de prueba detenido al terminar; API local para iPhone sigue en puerto 3000.
- Auditorías del clone: backend 0; frontend 22 (3 moderados, 19 altos, 0 críticos).

El primer clone detectó conversión CRLF de Windows; se corrigió la causa con
.gitattributes y se verificó un nuevo clone con LF. Las exportaciones Android/iOS
son bundles, no instalación nativa ni evidencia de una prueba en teléfonos.

## Hosting

El usuario aún no tenía una cuenta. Se propone Render Free para API/web y Aiven
Free MySQL, preservando Express y SQL. No existe todavía una URL de aplicación.
No se contrató un plan ni se reemplazó MySQL por otra tecnología.
La base XAMPP queda disponible para la evaluación local.

## Seguridad

Override reproducible de uuid para xcode: 29 → 22 avisos frontend.
Avisos restantes revisados y documentados en [security.md](security.md);
no se declara preparación para producción ni resolución de avisos sin parche.

## Estado actual

- [x] XAMPP habitual y contraseña privada local configurados.
- [x] Login HTTP y flujo web con la base habitual.
- [x] Dependencia corregida de forma acotada y avisos restantes revisados.
- [ ] Ejecución y confirmación de pruebas iPhone.
- [ ] Pruebas Android, accesibilidad nativa y casos completos.
- [x] Push verificado a GitHub de main/develop.
- [x] Reproducción completa desde clone, incluida API contra SQL habitual.
- [ ] Hosting con cuentas gratuitas creadas por el usuario.
