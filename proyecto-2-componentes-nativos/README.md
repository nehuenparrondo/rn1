# Proyecto 2 · Componentes nativos

Proyecto independiente del punto 1. React Native 0.86.3, Expo SDK 57, Expo Router y TypeScript estricto.

## Consigna

Mostrar los componentes nativos de React Native y explicar para qué se usan, con un diseño. Se mantiene la identidad violeta oscuro y rosa/fucsia y el tema claro/oscuro persistente.

El control de tema es flotante y está abajo a la derecha, encima del botón **Volver arriba**. Este último aparece después de desplazarse y regresa al inicio con animación. Ambos respetan los márgenes seguros; la animación respeta la preferencia del sistema de reducir movimiento.

## Catálogo

25 entradas: los 24 componentes públicos de la documentación de React Native 0.86 y ProgressBarAndroid como componente legado.

Cada tarjeta incluye descripción en español, caso de uso, propiedades principales, fragmento orientativo de JSX y una demostración. Las listas se prueban horizontalmente; teclado, modal y actualización abren ventanas de ejemplo.

- Android e iOS comparten las demostraciones generales.
- DrawerLayoutAndroid, TouchableNativeFeedback y ProgressBarAndroid solo se ejecutan en Android.
- InputAccessoryView y el SafeAreaView original solo se ejecutan en iOS.
- SafeAreaView y ProgressBarAndroid están marcados como obsoletos. La aplicación usa react-native-safe-area-context para sus áreas seguras.
- No se presentan APIs como Alert, StyleSheet o Animated como si fueran componentes. Se excluyen exportaciones internas y experimentales.

Las imágenes están incluidas en assets; no dependen de servicios externos.

## Ejecutar

Usar Node.js 24 y npm. Abrir una terminal en la carpeta que contiene package.json; no ejecutar dentro del ZIP ni copiar node_modules de otra computadora. Este proyecto no necesita backend, XAMPP ni base de datos.

```powershell
npm ci
npx expo start --go --web --port 8082
```

Abrir la dirección web indicada por Expo (normalmente http://localhost:8082). Mantener la terminal abierta; Ctrl+C detiene el servidor. En el teléfono, escanear el QR nuevo con Expo Go compatible con SDK 57, en la misma red que la PC. En iPhone, Expo CLI y Expo Go deben usar la misma cuenta de Expo; iniciar sesión en la PC con npx expo login si hace falta.

Si la red escolar aísla los equipos, detener Expo y probar `npx expo start --go --tunnel --port 8082`, solo si la escuela lo permite. El túnel requiere Internet y puede estar bloqueado; no desactivar protecciones ni eludir restricciones. Si PowerShell bloquea npm.ps1, usar Símbolo del sistema o npm.cmd sin cambiar políticas de seguridad. No ejecutar npm audit fix --force para solucionar problemas de arranque.

```powershell
npm run web -- --port 8082
npm run lint
npm run typecheck
npm run build:web
npm run build:all
npx expo-doctor
```

## Organización

- src/app: rutas de Expo Router.
- src/pages: vista completa del catálogo.
- src/components/atoms: textos y botones reutilizables.
- src/components/molecules: ventanas compuestas con controles y textos.
- src/components/organisms: tarjetas y demostraciones interactivas.
- src/components/templates: estructura responsive.
- src/data: contenido del catálogo.
- src/context, src/hooks, src/services, src/styles y src/types: tema y persistencia.

## Estado de dependencias al publicar

El 14 de octubre de 2026 se comprobó una instalación limpia dentro de este repositorio: TypeScript, lint y exportación web aprobados para el proyecto 2. También aprobaron los controles de código/formato y la exportación web del proyecto 3 conservado en la raíz.

Expo Doctor aprobó 20/21 comprobaciones en la carpeta original del proyecto 2: recomienda parches compatibles para expo, expo-constants, expo-linking y expo-router. La publicación conserva las versiones fijadas, sin forzar actualizaciones. La instalación limpia informó 29 avisos de npm audit (10 moderados y 19 altos), además de avisos de deprecación en herramientas/dependencias. No se afirma que la auditoría esté limpia ni que la publicación equivalga a una prueba física.

## Prueba manual en celular

Recorrer las tarjetas, escribir en TextInput, pulsar los controles, cambiar Switch, deslizar las listas, abrir y cerrar Modal, mostrar el teclado y recargar con RefreshControl. Alternar el tema y comprobar su persistencia después de cerrar y abrir. Revisar orientación vertical y horizontal.

## Referencias

- [Componentes de React Native 0.86](https://reactnative.dev/docs/0.86/components-and-apis)
- Cada componente: https://reactnative.dev/docs/0.86/ seguido de su nombre en minúsculas.
- [Referencia de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- [Inicio de sesión de Expo Go en iOS](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/)
