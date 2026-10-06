# Componentes y contratos

Catálogo del frontend actual. Las rutas están en app/ y las vistas en src/pages/;
los archivos de Atomic Design no ejecutan SQL. Consultar el árbol completo en
[README](../README.md) antes de los ejemplos.

## Atoms: una responsabilidad visual

| Componente        | Props principales                                                         | Uso y límites                                                                                                    |
| ----------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| AppText           | TextProps, variant, tone, style                                           | Texto con tipografía y color del tema; conserva el escalado del sistema.                                         |
| Button            | label, onPress; loading, disabled, variant, accessibilityLabel opcionales | Acción de ancho flexible. loading bloquea pulsaciones y muestra spinner. Variante primary o secondary.           |
| Input             | TextInputProps, ref, invalid, valid                                       | Campo controlado. Prioriza borde de error, foco, validación y estado neutro; no valida credenciales por sí solo. |
| IconButton        | icon, label, onPress; disabled, selected, size, variant                   | Ícono Ionicons con etiqueta obligatoria; tamaño 44 o 56 y variante primary o quiet.                              |
| Card              | ViewProps, children, style                                                | Superficie tematizada flexible, sin altura fija; borde, radio y sombra centralizados.                            |
| EntranceView      | children, style                                                           | Fade de entrada de 220 ms; respeta movimiento reducido y detiene la animación al desmontar.                      |
| ThemeToggleButton | Sin props                                                                 | Lee useTheme y safe areas. Global en el layout, abajo a la derecha; se oculta con teclado nativo abierto.        |
| ScrollToTopButton | visible, onPress                                                          | Fade de 180 ms; arriba del tema. Cuando está oculto no recibe toques ni foco accesible. No decide el umbral.     |

Las constantes de posición están en src/constants/app.ts. La mayoría de medidas
son puntos de React Native, no una resolución física del dispositivo.
StyleSheet.create contiene la estructura; las pequeñas variantes de tema y
dimensiones se aplican en arrays de estilos, no en hojas CSS separadas.

## Molecules: composición pequeña

| Componente    | Contrato                                                | Responsabilidad                                                                                                                                   |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| TextField     | label; error, hint, valid, isPassword y props del Input | Etiqueta + input + mensaje + visibilidad opcional. Si hay error, sustituye el hint. No permite sobrescribir invalid/secureTextEntry directamente. |
| BrandHeader   | Sin props                                               | Logo NP y nombre compartido; no inventa enlaces de navegación.                                                                                    |
| InfoRow       | icon, title, description                                | Explicación breve con ícono y texto que se adapta al ancho.                                                                                       |
| UserDetailRow | label, value                                            | Dato público seleccionable, divisor y distribución flexible.                                                                                      |

La visibilidad de contraseña es estado local de TextField, no se persiste.
El nombre accesible del input puede personalizarse sin perder la etiqueta visual.

## Organisms: bloques funcionales

| Componente  | Contrato                        | Responsabilidad                                                                                                                             |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| LoginForm   | Sin props                       | Usa useLoginForm, refs para Next/Done, bloqueo de envío y errores. No navega ni conoce la configuración SQL.                                |
| ScreenShell | children, contentStyle opcional | SafeAreaView, KeyboardAvoidingView, ScrollView, ancho máximo, espacio para controles y scroll-to-top. Cada pantalla tiene su propio scroll. |

El botón de tema pertenece al layout raíz para no duplicarlo por pantalla.
El botón de scroll pertenece al contenedor que conoce su ScrollView; así no
se intenta desplazar una pantalla distinta.

## Pages y rutas

| Archivo         | Entrada                                            | Responsabilidad                                                                                                 |
| --------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| LoginPage       | onRegister: () => void                             | Componer presentación, LoginForm y acceso a crear cuenta. Apilado en móvil/tablet y dividido desde 1100 puntos. |
| WelcomePage     | WelcomePageProps: user: User, onLogout: () => void | Renderizar los datos públicos recibidos por props y acciones reales. No obtiene user de AuthContext.            |
| app/index.tsx   | Usuario del contexto                               | Si parseUser valida el estado, redirigir; si no, mostrar LoginPage.                                             |
| app/welcome.tsx | Usuario del contexto y router                      | Validar, redirigir sin usuario y entregar props. Coordinar signOut y router.replace.                            |
| app/_layout.tsx | Providers globales                                 | Safe areas, ThemeProvider, AuthProvider, Stack, status bar y control flotante de tema.                          |

**Expo Router no inyecta props arbitrarias a la ruta: WelcomeRoute adapta el
estado compartido validado y lo pasa como props tipadas a WelcomePage.**

Ejemplo del contrato real, no de una ruta nueva:

```tsx
<WelcomePage user={publicUser} onLogout={handleLogout} />
```

User tiene id, name, email, role y lastLoginAt. Ningún campo es password o hash.
El callback permite a la vista pedir la salida sin depender del router.

## Contexts y hooks

| Unidad                   | Devuelve / ofrece                                                                                       | Motivo de separación                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ThemeProvider / useTheme | theme, mode, isReady, storageError, toggleTheme                                                         | Sistema por defecto; elección light/dark en AsyncStorage. Serializa escrituras y comunica fallos de almacenamiento. |
| AuthProvider / useAuth   | user, isAuthenticating, signIn, signOut                                                                 | Estado público en memoria, petición cancelable y protección frente a resultados después de salir.                   |
| useLoginForm             | email, password, errors, touched, message, isSubmitting; changeEmail, changePassword, blurField, submit | Lógica del formulario sin navegación. Valida al perder foco/enviar y evita concurrencia.                            |
| useBreakpoint            | Dimensiones y clasificación del ancho                                                                   | Usa useWindowDimensions; móvil <768, tablet desde 768, desktop desde 1100. La orientación depende de ancho/alto.    |
| useScrollToTop           | scrollRef, isVisible, handlers de scroll/layout/contenido, scrollToTop                                  | Exige contenido desplazable y offset >240; scrollEventThrottle de 16 ms.                                            |
| useKeyboardVisible       | boolean                                                                                                 | Ocultar flotantes al abrir teclado nativo; el navegador no reproduce ese evento de teclado virtual.                 |
| useReducedMotion         | boolean                                                                                                 | Respetar preferencia de accesibilidad en entrada, scroll y transición.                                              |

Los hooks de contexto exigen su provider. No guardar una contraseña en un
contexto global ni introducir efectos secundarios dentro del render.

## Servicio, validaciones y presentación

- apiConfig: valida EXPO_PUBLIC_API_URL pública HTTP/HTTPS y compone el endpoint.
- authService.loginRequest: POST JSON, AbortController, timeout de 10 segundos,
  clasificación de errores HTTP/red/cancelación y parseo estricto de la respuesta.
- validation: email, vacíos y contraseña de 8 caracteres/72 bytes UTF-8.
  Normaliza email, nunca recorta ni modifica password.
- responseGuards: JSON entra como unknown; parseUser/parseLoginResponse revisan
  tipos y copian solo campos permitidos. TypeScript no valida una red en ejecución.
- userPresentation: etiquetas para roles conocidos y fecha real en horario local.
- ApiError: error tipado con kind, message y errores por campo opcionales.
- styles/: colores, spacing, radios, sombras, tipografía y breakpoints.
- constants/: mensajes, rutas, tiempo de espera y medidas comunes; sin secretos.

## Cómo extender sin duplicar

1. Declarar el contrato en types/ y el endpoint en el backend por responsabilidades.
2. Añadir la llamada HTTP a services/ con validación de respuesta.
3. Separar estado/lógica en un hook cuando sea reutilizable.
4. Crear la página componiendo atoms/molecules/organisms existentes.
5. Añadir una ruta fina que adapte los datos y pase props.
6. Repetir ambos temas, tamaños y estados de error en [el plan de pruebas](testing.md).

Registro real agregado por solicitud expresa; detalles en [registration.md](registration.md).
RegisterPage recibe onLogin; RegistrationForm usa useRegistrationForm y FormNotice.
El transporte de registro comparte timeout/cancelación y valida respuestas desconocidas.
No añadir un dashboard ni recuperación de contraseña por apariencia:
no pertenecen a esta consigna y requerirían contratos reales.
