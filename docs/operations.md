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
La publicación se registra como completada únicamente después de verificar el push.

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
- [ ] Push verificado a GitHub y reproducción desde clone.
- [ ] Hosting con cuentas gratuitas creadas por el usuario.
