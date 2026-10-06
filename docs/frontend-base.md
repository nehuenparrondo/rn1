# Parte 4 — Bases del frontend

> Documento de etapa: describe la Parte 4. Las pantallas ya están conectadas;
> consultar screens.md y delivery.md para la integración y entrega.

Se trabaja directamente en proyecto-3-acceso-usuarios, sin modificar los proyectos
anteriores. Expo **57.0.26**, Router **57.0.24**, React Native **0.86.3** y TypeScript
**6.0.3** se conservan; no se instaló ninguna dependencia nueva.

**Alcance:** tema, estado, hooks, validaciones, servicio HTTP y componentes reutilizables.
El formulario real, la bienvenida y sus props se conectan en la Parte 5.
La vista actual sigue siendo provisional, pero ya utiliza los providers y el tema.

## Árbol real antes de los ejemplos

```text
app/
├── _layout.tsx
├── index.tsx
└── welcome.tsx
src/
├── components/
│   ├── atoms/
│   │   ├── AppText.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── ScrollToTopButton.tsx
│   │   └── ThemeToggleButton.tsx
│   ├── molecules/
│   │   └── TextField.tsx
│   └── organisms/
│       └── ScreenShell.tsx
├── constants/
│   ├── app.ts
│   └── messages.ts
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useBreakpoint.ts
│   ├── useKeyboardVisible.ts
│   ├── useLoginForm.ts
│   ├── useReducedMotion.ts
│   ├── useScrollToTop.ts
│   └── useTheme.ts
├── pages/
│   └── LoginPage.tsx
├── services/
│   ├── apiConfig.ts
│   └── authService.ts
├── styles/
│   ├── breakpoints.ts
│   ├── colors.ts
│   ├── shadows.ts
│   ├── spacing.ts
│   ├── theme.ts
│   └── typography.ts
├── types/
│   ├── auth.ts
│   └── theme.ts
└── utils/
    ├── ApiError.ts
    ├── responseGuards.ts
    └── validation.ts
docs/
├── database.md
├── backend.md
└── frontend-base.md
```

El código completo ya está guardado en esos archivos. Los archivos TypeScript
incluyen comentario inicial de ruta y propósito en español. Se quitaron los
.gitkeep vacíos y setupStyles.ts, reemplazado por tokens y componentes reales.

## Tema y diseño

La paleta oscura mantiene violeta casi negro, superficies violetas, rosa/fucsia
y acento lavanda. La clara utiliza fondo suave, texto violeta y fucsia más oscuro
para mantener contraste. No se agregaron pantallas ni funciones ajenas al login.

- ThemeProvider utiliza useColorScheme mientras no haya elección propia.
- Lee solo la clave @np-user-access/theme-v1 de AsyncStorage.
- Durante la lectura muestra un indicador: evita presentar la página con
  una preferencia incorrecta antes de restaurar el tema.
- Al cambiar tema actualiza la interfaz y serializa sus escrituras.
- Si falla el almacenamiento, el tema sigue funcionando y se muestra un aviso.
- Nunca guarda contraseña, hash, usuario ni tokens en AsyncStorage.
- AppText, Input, Button, Card y los controles reciben colores del mismo contexto.
- Tipografía, espacios, radios, sombras y breakpoints están centralizados.

Los colores principales de texto sobre tarjetas y botones se verificaron
numéricamente con contraste mínimo 4.5:1 en ambos temas. Esto no sustituye una
auditoría completa de accesibilidad ni las pruebas con lectores de pantalla.

## Atomic Design y contratos

| Componente        | Responsabilidad                                    | Props principales                                        |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------- |
| AppText           | Texto con tipografía y tono del tema.              | variant, tone y TextProps.                               |
| Button            | Acción con feedback, bloqueo y spinner.            | label, onPress, loading, disabled, variant.              |
| IconButton        | Acción representada por un ícono.                  | icon, label obligatorio, onPress, size 44/56, variant.   |
| Input             | TextInput nativo con foco y estado visual.         | TextInputProps, ref, invalid, valid.                     |
| Card              | Superficie flexible sin altura fija.               | ViewProps y children.                                    |
| ThemeToggleButton | Alternar tema global abajo a la derecha.           | Sin props; usa contexto y safe areas.                    |
| ScrollToTopButton | Fade del control sobre el botón de tema.           | visible, onPress.                                        |
| TextField         | Etiqueta, input, ayuda/error y mostrar contraseña. | label, error, hint, valid, isPassword y props del input. |
| ScreenShell       | Safe areas, teclado y scroll compartidos.          | children, contentStyle.                                  |

Input conserva el ref para que la Parte 5 pueda mover el foco de email a password.
TextField transmite ese ref al átomo. Con React 19 el ref puede recibirse como prop.
No se usan APIs de teclado deprecadas como blurOnSubmit: la pantalla usará
submitBehavior y onSubmitEditing para Next/Done.

Button bloquea pulsaciones mientras loading es true. Los íconos decorativos
no duplican las etiquetas; las acciones tienen accessibilityRole y etiquetas
explícitas. La tipografía conserva el escalado del dispositivo.

### Ejemplo de composición

Ejemplo explicativo para la futura pantalla; no se agrega un formulario de demo
a la ruta actual:

```tsx
<TextField
  label="Email"
  value={email}
  onChangeText={changeEmail}
  error={errors.email}
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
/>
<Button label="Ingresar" loading={isSubmitting} onPress={() => void submit()} />
```

La Parte 5 agregará foco, validación al perder foco, navegación tras éxito
y mostrar/ocultar contraseña mediante las piezas existentes.

## Hooks y estado

| Hook               | Devuelve / controla                                                 |
| ------------------ | ------------------------------------------------------------------- |
| useTheme           | Tema, modo, hidratación, error de persistencia y toggleTheme.       |
| useAuth            | user, isAuthenticating, signIn y signOut.                           |
| useBreakpoint      | Ancho, alto, fontScale, clasificación y orientación actual.         |
| useKeyboardVisible | Visibilidad del teclado nativo para no tapar el formulario.         |
| useReducedMotion   | Preferencia del sistema para reducir animaciones.                   |
| useScrollToTop     | Ref del ScrollView, eventos de tamaño/scroll, visibilidad y acción. |
| useLoginForm       | Campos, errores, touched, mensaje, loading, cambios, blur y submit. |

AuthProvider conserva únicamente User público **en memoria**. Recargar borra ese
estado; no es una sesión de servidor ni una autorización segura.
signIn bloquea solicitudes concurrentes. signOut limpia el usuario y aborta
una solicitud pendiente; una respuesta posterior no puede restaurarlo.
Al desmontarse el provider se cancela su petición.

useLoginForm no conoce Expo Router. Valida localmente, devuelve User o null,
y limpia password tras éxito. La pantalla decidirá cómo navegar.
Los inputs deben quedar no editables mientras el formulario envía.

### Responsive y controles flotantes

- useWindowDimensions actualiza ancho/alto al rotar o cambiar de tamaño.
- Móvil: ancho menor de 768; tablet: 768–1099; escritorio: desde 1100.
- ScreenShell limita el contenido a 1120 puntos y reserva espacio inferior
  para que las acciones flotantes no tapen el final.
- La tarjeta provisional y el futuro formulario usan máximo 480, con width 100%.
- ScreenShell comparte KeyboardAvoidingView, safe areas y un ScrollView.
- Tema está en el layout raíz: presente en todas las rutas.
- Scroll-to-top es de cada ScreenShell: no conserva un ref de la pantalla anterior.
- Umbral: más de 240 puntos de desplazamiento, con contenido mayor al viewport.
- Aparece/desaparece con Animated; scrollTo vuelve al inicio animado.
- Cuando el sistema pide movimiento reducido se omiten esas animaciones.
- El scroll está **arriba del botón de tema**, según la rúbrica del proyecto 3,
  con 12 puntos de separación. No se cambia la disposición del proyecto 2.
- Mientras aparece el teclado nativo se ocultan los controles para no tapar inputs.
- El control oculto no acepta toques ni se expone al lector de pantalla.
- No se agrega contenido ficticio para forzar scroll. La bienvenida real de la
  Parte 5 tendrá tarjetas suficientes para comprobarlo.

## Validación sin Node dentro del celular

validation.ts replica la política del backend:

- Email recortado y en minúsculas, ASCII, máximo 254 caracteres.
- Formato de parte local/dominio igual al servidor; acepta apóstrofos como datos.
- Password sin recortar: mínimo 8 caracteres y máximo 72 **bytes UTF-8**.
- Campos vacíos y password solo de espacios se rechazan.
- getUtf8ByteLength cuenta bytes por punto de código; no usa Buffer, que es de Node.
- Mensajes por campo para bordes rojos y feedback bajo inputs.

El servidor vuelve a validar: el cliente no es una frontera de seguridad.

## Servicio HTTP

authService.loginRequest recibe LoginRequest y un AbortSignal opcional.
Solo envía POST /api/auth/login con cuerpo JSON y Content-Type application/json.
No manda contraseña en URL, cookies ni datos adicionales.

```text
useLoginForm → AuthProvider.signIn → authService.loginRequest
→ API → JSON desconocido → validación de contrato → User público
```

apiConfig lee directamente process.env.EXPO_PUBLIC_API_URL para que Expo pueda
sustituirla en el bundle. Rechaza URLs con credenciales, query, fragmento o ruta /api.
Admite un origen HTTP/HTTPS; HTTPS es obligatorio fuera de pruebas locales.

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Celular físico: usar la IP LAN de la PC, no localhost. Emulador Android:
http://10.0.2.2:3000. Ver las instrucciones de red/firewall del README.
La URL es pública: nunca poner ahí la contraseña SQL.

El servicio aplica un timeout de **10 segundos**, también durante la lectura del JSON,
y distingue ApiError de red, timeout, cancelación, configuración, contrato y HTTP.
No inventa un usuario si la red falla. No imprime credenciales ni respuestas privadas.

responseGuards comprueba tipos, id positivo, email, rol y fecha UTC válida;
copia solo id/name/email/role/lastLoginAt. Un hash añadido inesperadamente a una
respuesta no se propaga al contexto ni a props. TypeScript por sí solo no valida
JSON recibido de Internet.

401 y 429 usan mensajes locales uniformes. 500 y errores HTTP inesperados usan
texto genérico, no el mensaje SQL remoto. 400 puede devolver errors por campo.
Retry-After numérico queda disponible en ApiError, sin implementar un contador visual.

## Ejecución y comprobaciones

Desde la carpeta del proyecto:

```powershell
npm run check
npm run build:all
npm start -- --lan --port 8083
```

No iniciar otro Metro si ya está corriendo el de este proyecto en 8083.
No se sustituyeron los puertos de los proyectos 1 y 2.

Se verificaron:

- **53 comprobaciones** aisladas de validaciones, UTF-8, URLs, JSON y contraste.
- Servicio frontend contra HTTP local: POST y cuerpo exactos, éxito público,
  400/401/429/500, HTML/JSON inválido, cancelación, fallo de red y timeout real de 10 s.
- Cambio claro/oscuro y persistencia tras recargar el navegador.
- Vista web a 390×844, 820×1180 y 1440×900, sin desbordamiento horizontal observado.
- Pantalla reducida a 320×240: scroll aparece después del umbral y vuelve arriba;
  en vistas sin desplazamiento permanece oculto.
- Lint, typecheck, formato y exportación web/Android/iOS.

Las comprobaciones aisladas no constituyen una suite permanente añadida al proyecto.
Se revisa el código real; los archivos auxiliares quedan fuera del repositorio.

**Límites:** exportar Android/iOS no equivale a ejecutar en Expo Go.
No se probó todavía teclado nativo, inputs reales, login contra el XAMPP habitual,
navegación con props ni logout desde una bienvenida: corresponden a las Partes 5/6.
La contraseña SQL local continúa pendiente.

## ¿Qué rúbrica cubre esto?

- [x] Styles, constants y tipos centralizados; TypeScript estricto sin any.
- [x] ThemeContext/useTheme, sistema por defecto y AsyncStorage solo para el tema.
- [x] AuthContext/useAuth en memoria y cancelación de solicitudes.
- [x] Validación cliente y servicio configurable con errores/timeout.
- [x] Atomic Design, controles accesibles y tamaños flexibles.
- [x] Tema global y base de scroll reutilizable sin superposición.
- [x] Comentarios españoles, nombres ingleses y documentación de componentes.
- [ ] Login real, bienvenida con props y layout final: Parte 5.
- [ ] Configurar XAMPP habitual y probar dispositivos reales.
- [ ] Defensa, capturas finales y publicación: Parte 6.

## Preguntas para defender estas bases

**¿Por qué usar Context?** Comparte el tema y los datos públicos sin pasarlos
por cada nivel de componentes; no sustituye seguridad de servidor.

**¿Qué es un hook personalizado?** Una función que compone hooks y encapsula
lógica reutilizable. useLoginForm no se encarga de dibujar ni navegar.

**¿Por qué validar JSON si usamos TypeScript?** Los tipos se eliminan al compilar;
una respuesta remota puede no respetarlos y debe verificarse en ejecución.

**¿Por qué contar bytes?** bcrypt considera como máximo 72 bytes, no 72 letras.
Un emoji ocupa más bytes UTF-8 que un carácter ASCII.

**¿Qué se persiste?** Únicamente el modo visual. No se guarda una contraseña
ni se crea una sesión permanente con datos públicos de un usuario.

**¿Cómo evita el scroll una referencia incorrecta?** Cada ScreenShell crea
su propio ref y responde a sus eventos de tamaño y desplazamiento.

**¿Qué falta para cumplir props?** La ruta welcome de la Parte 5 validará
los datos públicos y renderizará WelcomePage mediante props tipadas.

## Referencias

- [Tema del sistema en React Native](https://reactnative.dev/docs/usecolorscheme)
- [Animated](https://reactnative.dev/docs/animated)
- [ScrollView](https://reactnative.dev/docs/scrollview)
- [TextInput y submitBehavior](https://reactnative.dev/docs/textinput)
- Variables Expo: [URL pública en el bundle](https://docs.expo.dev/guides/environment-variables/).
- AsyncStorage 2.2.0: tipos y API comprobados en la dependencia instalada.

Escribí **continuar** para la Parte 5, que conecta estas piezas con las pantallas.
