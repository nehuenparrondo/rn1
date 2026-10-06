# Revisión de dependencias y límites de seguridad

Revisión del 5 de octubre de 2026 sobre Expo SDK 57, sin downgrades forzados.
Auditoría repetida para backend 0.4.0 y frontend 0.6.0: backend 0;
frontend **22 avisos**
(3 moderados y 19 altos), frente a 29 de la revisión documental anterior.
Los totales son paquetes afectados, no 22 vulnerabilidades independientes.

## Corrección compatible aplicada

El override acotado xcode → uuid 11.1.1 elimina la versión 7.0.3.
xcode utiliza uuid.v4 y se verificó que sigue generando identificadores válidos
de 24 caracteres hexadecimales para proyectos Apple.
uuid 11.1.1 mantiene entrada CommonJS, necesaria para ese consumidor.
Se conservan Expo 57.0.26, Router 57.0.24 y React Native 0.86.3.

La versión corregida figura en
[el aviso oficial de uuid](https://github.com/advisories/GHSA-w5hq-g745-h8pq).
No se editan archivos de node_modules manualmente: el override y lockfile hacen
reproducible la resolución con npm ci.

## Avisos que no se declararon resueltos

| Dependencia raíz del aviso   | Situación comprobada                                                                                | Decisión                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| braces <=3.0.3               | Aviso revisado sin versión corregida publicada al revisar; usada por herramientas Metro/micromatch. | No inventar una versión ni exponer Metro en Internet.                             |
| node-forge <=1.4.0           | Aviso revisado sin versión corregida publicada al revisar; herramientas de Expo/firma.              | No habilitar firma/actualizaciones remotas como si este aviso estuviera resuelto. |
| decode-uri-component <=0.4.2 | Existe 0.5.0 corregida; Router 57 usa query-string 7 con consumidor CommonJS.                       | No forzar un reemplazo ESM ni Router 58 sin revisar compatibilidad completa.      |

Referencias:
[braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
[node-forge](https://github.com/advisories/GHSA-86w9-cpqp-85rv),
[decode-uri-component](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr).
La propagación a Expo/React Native/Metro explica múltiples avisos del mismo origen.

La revisión distingue rutas de uso, pero no supone que una dependencia transitiva
sea inocua ni constituye una auditoría completa. No afirmar “cero vulnerabilidades”
del frontend. npm audit fix --force propone versiones incompatibles del SDK;
no es una solución aceptable para este trabajo.

## Configuración local real

- Solo se creó np_user_access y su cuenta limitada en C:/xampp/mysql/data, puerto 3306.
- Password SQL aleatorio guardado exclusivamente en backend/.env ignorado.
- No se modificaron las bases auth_system_db, sistema_usuarios ni sus usuarios.
- Cuenta del backend sin UPDATE/DELETE/DDL; restricción comprobada.
- Registro: INSERT de cuatro columnas en users, rol student controlado por la API.
- Base remota: TLS opcional con CA e identidad verificadas; nunca desactivar certificados.
- MariaDB de esta ejecución escucha en 127.0.0.1, no en la LAN.
- La API y Metro sí deben alcanzar el celular, solo por red privada.
- No se desactivó el firewall ni se abrió MySQL/phpMyAdmin a Internet.

El bind de MariaDB corresponde al proceso iniciado para esta prueba. Al iniciarlo
posteriormente desde el panel XAMPP, revisar su configuración/firewall: no se
cambió el my.ini compartido de otros trabajos.

## Alcance de una publicación

Publicar código no publica .env ni la base local. La futura API requiere HTTPS,
conexión SQL cifrada y validación de certificados cuando la BD sea remota,
cuenta dedicada y orígenes web exactos.
El seed es exclusivamente ficticio. No usar sus contraseñas como usuarios reales.
Las cuentas/servicios de hosting se configuran por separado; no se contrataron planes.
