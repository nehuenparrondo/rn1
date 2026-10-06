# Guía de Git y colaboración

**Estado al cerrar la Parte 6:** repositorio local inicializado, HEAD apunta a master sin commits.
No existe remoto; main, develop y feature/* son una guía, no ramas ya creadas.
Estos comandos no se ejecutaron automáticamente. El ZIP no incluye .git/.

La autorización/publicación posterior del usuario se registra en operations.md.

## Convenciones

Formato: tipo(ámbito): descripción breve.

| Tipo     | Ejemplo                                         | Cuándo usarlo                                         |
| -------- | ----------------------------------------------- | ----------------------------------------------------- |
| feat     | feat(auth): conectar formulario con la API      | Funcionalidad nueva.                                  |
| fix      | fix(auth): evitar doble envío                   | Corrección de comportamiento.                         |
| docs     | docs: completar guía de defensa                 | Solo documentación.                                   |
| refactor | refactor(ui): extraer TextField                 | Cambiar estructura conservando comportamiento.        |
| style    | style: aplicar formato consistente              | Formato de código, no una funcionalidad visual nueva. |
| chore    | chore: actualizar configuración de herramientas | Mantenimiento.                                        |

No inventar commits históricos para aparentar trabajo por etapas. El primer
commit puede describir honestamente el proyecto integrado; CHANGELOG conserva
la explicación de las seis partes, no prueba que existan seis commits.
La convención se apoya en [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).

## Antes del primer commit

Desde la raíz del proyecto:

```powershell
git status --short
git check-ignore .env backend/.env backend/database/create_app_user.local.sql
npm run check
npm --prefix backend run check
git add .
git diff --cached --check
git diff --cached --stat
git diff --cached
```

git add no publica; prepara archivos. **Antes de continuar**, verificar que solo
hay código, documentación, assets, SQL público, .env.example y ambos lockfiles.
No debe aparecer .env, *.local.sql, node_modules, dist, dumps SQL de datos reales,
tokens, contraseñas privadas o capturas de phpMyAdmin con autenticación.
Las credenciales del seed son ficticias y públicas, exclusivamente de desarrollo.

Si un archivo privado está preparado pero nunca se ha confirmado:

```powershell
git rm --cached -- .env
```

Usar su ruta exacta; esto conserva la copia local. Si un secreto ya fue publicado,
ignorarlo no lo elimina del historial: revocarlo/rotarlo y revisar la exposición.
No pegar el secreto en un issue ni confiar únicamente en una búsqueda automática.

### Inicializar la entrega, cuando decidas hacerlo

El repositorio local ya existe. En una extracción nueva del ZIP, primero git init.
Después de revisar los archivos preparados:

```powershell
git commit -m "feat: integrar acceso de usuarios con Expo y API SQL"
git branch -M main
git switch -c develop
```

No se modifica user.name/user.email automáticamente. Si Git pide identidad,
configurar tus datos localmente en ese repositorio antes del commit.
La guía de [ramas de Git](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
explica separación y fusión; main/develop son nuestra política de trabajo.

## Ciclo de una mejora posterior

Con el primer commit existente y el árbol de trabajo limpio:

```powershell
git switch develop
git switch -c feature/mejorar-accesibilidad
```

Implementar una mejora concreta, revisar el diff y ejecutar las comprobaciones.
Preparar solo sus archivos, crear un commit descriptivo y volver a integrar:

```powershell
git switch develop
git merge --no-ff feature/mejorar-accesibilidad
```

Después de validar la integración:

```powershell
git switch main
git merge --no-ff develop
```

Si hay conflictos, resolverlos y repetir las pruebas; no sobrescribir archivos
sin entender los cambios. En colaboración usar una pull request revisada.
No usar push --force para solucionar un error de publicación.

## GitHub: publicación manual

1. Elegir el nombre y visibilidad del repositorio; respetar las reglas académicas.
2. Crear un repositorio vacío, sin README inicial que compita con el local.
3. Copiar su URL real. No existe todavía una URL de entrega de este proyecto.
4. Con main y develop creadas, añadir el remoto y publicar:

```powershell
$repositoryUrl = Read-Host "Pegá la URL real del repositorio vacío"
git remote add origin $repositoryUrl
git remote -v
git push -u origin main
git push -u origin develop
```

Autenticarse en GitHub sin guardar tokens en archivos del proyecto. Si origin
ya existe, inspeccionarlo; no reemplazarlo a ciegas. Comprobar en GitHub el README,
las imágenes relativas, SQL público y ausencia de secretos.
Finalmente clonar en otra carpeta, instalar con npm ci y seguir el README.

## SemVer y CHANGELOG

- Frontend actual: **0.5.2**, revisión operativa y de dependencias de la integración 0.5.0.
- Backend actual: **0.3.0**, API sin cambios en las partes de frontend.
- 0.x indica desarrollo previo a la entrega validada; no prometer estabilidad pública.
- Para una API pública estable, SemVer distingue parche compatible, funcionalidad
  compatible y cambio incompatible. Documentar cambios en vez de subir versiones
  sin motivo. Referencia: [SemVer](https://semver.org/lang/es/).
- Cambiar package.json y su lockfile de forma coherente; en frontend también app.json.
- CHANGELOG se edita al introducir cambios; no marcar como publicada una versión local.

Solo tras cerrar XAMPP, dispositivos y checklist se puede proponer 1.0.0,
actualizar la documentación y crear una etiqueta/release. No se creó ninguna
etiqueta ni se ejecutaron estos comandos durante la asistencia.
