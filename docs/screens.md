# Parte 5 — Login y bienvenida conectados

> Documento de etapa: registra la integración 0.5.0. La revisión documental
> 0.5.1 y checklist final están en delivery.md; la API no cambió.

La aplicación ya realiza **formulario → API → bienvenida** con React Native,
Expo Router y TypeScript estricto. Se mantiene la identidad violeta/fucsia.
No se agregaron recuperación de contraseña, registro, menús ni endpoints extra.

## Árbol real del frontend

El árbol completo del proyecto, incluido el backend sin cambios, está en README.md.
Estos son los archivos actuales del frontend antes de los ejemplos de código:

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
│   │   ├── EntranceView.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── ScrollToTopButton.tsx
│   │   └── ThemeToggleButton.tsx
│   ├── molecules/
│   │   ├── BrandHeader.tsx
│   │   ├── InfoRow.tsx
│   │   ├── TextField.tsx
│   │   └── UserDetailRow.tsx
│   └── organisms/
│       ├── LoginForm.tsx
│       └── ScreenShell.tsx
├── pages/
│   ├── LoginPage.tsx
│   └── WelcomePage.tsx
├── services/
│   ├── apiConfig.ts
│   └── authService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useBreakpoint.ts
│   ├── useKeyboardVisible.ts
│   ├── useLoginForm.ts
│   ├── useReducedMotion.ts
│   ├── useScrollToTop.ts
│   └── useTheme.ts
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── utils/
│   ├── ApiError.ts
│   ├── responseGuards.ts
│   ├── userPresentation.ts
│   └── validation.ts
├── styles/
│   ├── breakpoints.ts
│   ├── colors.ts
│   ├── shadows.ts
│   ├── spacing.ts
│   ├── theme.ts
│   └── typography.ts
├── constants/
│   ├── app.ts
│   └── messages.ts
└── types/
    ├── auth.ts
    └── theme.ts
```

El código completo ya está guardado directamente en los archivos, con comentarios
de ruta y propósito en español. No hay que copiar bloques sobre el proyecto existente.

## Cómo se cumple el requisito de props

**Expo Router usa rutas; WelcomeRoute valida el usuario en memoria y se lo entrega
a WelcomePage mediante props tipadas.**

Se elige estado compartido, permitido por la consigna, en lugar de duplicar datos
personales en parámetros URL. AuthContext guarda únicamente datos públicos devueltos
por el backend. La ruta no confía en una URL que diga name o role.

```text
LoginForm → useLoginForm → AuthProvider.signIn
→ POST JSON /api/auth/login → comparación bcrypt/SQL
→ respuesta pública → AuthContext.user
→ LoginRoute redirige a /welcome
→ WelcomeRoute valida el estado → WelcomePage recibe props
```

Contrato implementado:

```ts
export interface WelcomePageProps {
  user: User;
  onLogout: () => void;
}
```

La ruta contiene la adaptación, no la vista:

```tsx
const { user, signOut } = useAuth();
const router = useRouter();
const publicUser = parseUser(user);
if (!publicUser) return <Redirect href={ROUTES.login} />;

function handleLogout() {
  signOut();
  router.replace(ROUTES.login);
}

return <WelcomePage user={publicUser} onLogout={handleLogout} />;
```

WelcomePage no consulta AuthContext para obtener el usuario: utiliza user de sus
props para nombre, email, rol, identificador y fecha. ThemeContext se usa solo
para apariencia. La contraseña y el hash nunca viajan a la bienvenida ni en la URL.

Los datos públicos y las props no son un token: esta arquitectura no autoriza
futuros endpoints protegidos. JWT/autorización/SecureStore siguen siendo mejoras,
no funcionalidades implementadas.

## Responsabilidades nuevas

| Archivo             | Responsabilidad                                                   |
| ------------------- | ----------------------------------------------------------------- |
| app/index.tsx       | Mostrar el login o redirigir si hay usuario validado en memoria.  |
| app/welcome.tsx     | Validar estado, pasar props y coordinar logout/navegación.        |
| app/_layout.tsx     | Providers, tema global, status bar y transición de Stack.         |
| LoginPage.tsx       | Componer intro y formulario; layout apilado o dividido.           |
| LoginForm.tsx       | Inputs, foco, errores, botón y envío; no navegar ni ejecutar SQL. |
| WelcomePage.tsx     | Presentar props y accesos rápidos reales.                         |
| BrandHeader.tsx     | Identidad compartida sin una navegación ficticia.                 |
| InfoRow.tsx         | Ícono y descripción flexible.                                     |
| UserDetailRow.tsx   | Etiqueta y valor público seleccionable que puede envolver líneas. |
| EntranceView.tsx    | Animación de entrada compatible con movimiento reducido.          |
| userPresentation.ts | Formatear la fecha real en zona local y traducir roles conocidos. |

Se reutilizan los estilos, hooks, servicio y componentes de la Parte 4.
El backend mantiene su contrato y versión 0.3.0; frontend y app.json pasan a 0.5.0.

## Formulario

- Principal en /, con email y contraseña inicialmente vacíos.
- Email sin auto-capitalización ni auto-corrección; teclado de email.
- Siguiente/Enter en email enfoca password; Done/Enter en password envía.
- Botón para mostrar/ocultar contraseña, con etiqueta accesible.
- Validación al perder foco y al enviar, con mensajes bajo cada input.
- Bordes de foco, error y validación; no dependen únicamente del color.
- Al enviar muestra spinner y bloquea inputs, visibilidad y botón de ingreso.
- El hook y el contexto también impiden envíos concurrentes.
- 401 genérico, 429, fallos internos, red y timeout tienen mensajes claros.
- Un éxito actualiza el usuario público; la ruta redirige sin ponerlo en la URL.
- No hay cuentas precompletadas ni botones que aparenten funciones inexistentes.

## Bienvenida y salida

Se muestran los datos reales de la API, no valores inventados:

- Nombre, email, rol e id en la tarjeta de cuenta.
- Último evento exitoso en horario local mediante Intl.DateTimeFormat.
- Explicación del ingreso verificado y del estado conservado solo en memoria.
- Información sobre datos y preferencia de tema.
- Accesos rápidos funcionales: cambiar apariencia y cerrar sesión.

Cerrar sesión llama signOut, cancela cualquier petición pendiente, limpia user
y reemplaza la ruta por /. Los inputs nuevos quedan vacíos. Acceder directamente
a /welcome sin usuario, incluso con parámetros falsos, redirige al login.
Al recargar se pierde user, pero se conserva el tema.

## Responsive y usabilidad

- Móvil/tablet: contenido apilado, formulario centrado con máximo 480 puntos.
- Escritorio desde 1100: intro y formulario en dos columnas.
- Bienvenida: tarjetas apiladas en móvil y dos columnas desde tablet.
- useWindowDimensions adapta tamaño y orientación; textos sin altura fija.
- Safe areas y KeyboardAvoidingView compartidos mediante ScreenShell.
- El tema flotante es global; scroll-to-top se integra en ambas pantallas.
- Scroll aparece solo al superar el umbral con contenido desplazable.
- Las tarjetas de bienvenida proporcionan contenido útil para probar scroll.
- Scroll está arriba del tema, sin superponerse con él; se reserva espacio al final.
- Entrada con fade y transición de Stack; sin animación si se pide movimiento reducido.
- Áreas táctiles de al menos 44 puntos, etiquetas, alerts y escalado de tipografía.

El teclado nativo, lector de pantalla y comportamiento exacto de safe areas deben
verificarse en dispositivos reales; el navegador no los simula completamente.

## Preparación para ejecutar en tu XAMPP

La interfaz ya está conectada, pero backend/.env conserva el placeholder SQL.
No se adivinó una contraseña administrativa ni se modificó la instancia habitual.

1. Seguir docs/database.md: importar schema.sql y seed.sql una sola vez.
2. Crear np_login_app@127.0.0.1 con contraseña privada de al menos 24 caracteres.
3. Configurar esa contraseña en backend/.env; no usar la del formulario.
4. Iniciar MySQL de XAMPP y la API; Apache solo hace falta para phpMyAdmin.
5. Verificar EXPO_PUBLIC_API_URL y CORS_ORIGINS según la red actual.
6. Iniciar o reutilizar Metro en 8083.

```powershell
npm --prefix backend run dev
npm start -- --lan --port 8083
```

Son terminales distintas. No iniciar otro Metro si el proyecto ya está en 8083.
En web local usar localhost para la API; en iPhone/Android físico, IP LAN de la PC.
La configuración pública actual usa 192.168.1.2:3000 y se comprobó que esa IP
corresponde a la PC al probar esta parte. Revisarla si cambia la red.
El túnel de Expo no publica la API Express ni MySQL.

Credenciales del seed solo para desarrollo:

| Email            | Password          | Resultado                     |
| ---------------- | ----------------- | ----------------------------- |
| student@np.test  | StudentDemo!2026  | Bienvenida del estudiante.    |
| admin@np.test    | AdminDemo!2026    | Bienvenida del administrador. |
| inactive@np.test | InactiveDemo!2026 | Credenciales incorrectas.     |

## Pruebas realizadas

Se probó la interfaz web contra **Express real y MariaDB 10.4.32 aislada**,
con la cuenta SQL limitada. No fue un login simulado.
La base de prueba quedó bajo work/ y no está en el código ni en el ZIP.
Los procesos temporales se detuvieron al terminar las pruebas; para usar el
login normalmente hay que completar la configuración privada de XAMPP indicada arriba.

| Caso observado en el navegador             | Resultado                                               |
| ------------------------------------------ | ------------------------------------------------------- |
| Campos vacíos                              | Errores debajo de ambos inputs.                         |
| Email inválido y password corto            | Mensajes específicos; permanece en login.               |
| Password incorrecto                        | Credenciales incorrectas, sin revelar SQL.              |
| Email inexistente                          | El mismo mensaje genérico.                              |
| Cuenta inactiva                            | El mismo mensaje, aunque su password coincide.          |
| Mostrar/ocultar password                   | Alterna la visibilidad y la etiqueta del botón.         |
| Enter en email                             | Pasa el foco a password.                                |
| Enter en password                          | Envía el ingreso.                                       |
| Petición pendiente                         | Spinner y controles bloqueados.                         |
| Estudiante correcto                        | /welcome con su nombre, email, rol, id y fecha real.    |
| Administrador correcto                     | Sus propios datos, sin usar valores de la URL.          |
| Logout                                     | /, usuario limpio e inputs vacíos.                      |
| /welcome con parámetros falsos sin ingreso | Redirige a /.                                           |
| Recargar bienvenida                        | Vuelve al login; no hay sesión persistente.             |
| Tema en bienvenida y login                 | Cambia todas las superficies; se conserva al recargar.  |
| Scroll en ambas pantallas                  | Control aparece; vuelve arriba y se oculta.             |
| MariaDB aislada realmente apagada          | Mensaje interno genérico; inputs vuelven a habilitarse. |
| API de prueba realmente desconectada       | Error de conexión, sin navegar ni inventar un usuario.  |
| Conexión aceptada pero sin respuesta       | Timeout de 10 s y botón habilitado de nuevo.            |

Para observar timeout se usó un proxy temporal que retenía la respuesta;
para los logins normales se reenviaba a la API real sin modificar el contrato.
Las pruebas utilizaron un límite mayor solo en el proceso aislado; el código
entregable conserva 10 POST por IP cada 15 minutos.

Se revisaron tamaños web 390×844, 820×1180, 844×390 y 1440×900, sin
desbordamiento horizontal observado. Se guardaron capturas de ingreso,
bienvenida, loading y timeout fuera del proyecto, en la entrega de esta parte.

También se repitieron las **53 comprobaciones de regresión** de utilidades y servicio
de la Parte 4. Lint, typecheck, formato y exportación web/Android/iOS están comprobados.

**Pendiente:** XAMPP habitual con su secreto privado y pruebas manuales en iPhone,
Android, teclado nativo y lector de pantalla. Exportar los bundles no equivale
a ejecutar la app en un teléfono. El aviso de colores del terminal del entorno
de compilación no corresponde a un warning de la interfaz.

## ¿Qué rúbrica cubre esto?

- [x] Formulario principal → API → bienvenida con datos reales.
- [x] Datos públicos pasados por props, con validación de la ruta.
- [x] Loading, errores y éxito; foco y mostrar/ocultar contraseña.
- [x] Logout y redirección sin usuario en memoria.
- [x] Atomic Design, nombres ingleses y comentarios españoles.
- [x] Layouts móvil/tablet/escritorio y base para orientación/teclado.
- [x] Tema y scroll en ambas pantallas; animaciones accesibles.
- [x] Pruebas web con backend/SQL reales y regresión del servicio.
- [ ] Configurar la base habitual y probar Android/iOS reales.
- [ ] Revisión final, GitHub, defensa y entrega: Parte 6.

## Para defender esta parte

**¿Dónde se usan props?** WelcomeRoute entrega user y onLogout a WelcomePage,
que renderiza datos desde esos argumentos tipados.

**¿Por qué no pasar password por una ruta?** La bienvenida no la necesita y una
URL puede quedar en historial o registros. Solo se envía en el cuerpo del login.

**¿La bienvenida hace SQL?** No. LoginForm usa el servicio HTTP; el backend hace
la consulta. La vista solo presenta datos públicos.

**¿Por qué al recargar hay que ingresar otra vez?** El usuario vive en memoria,
no en AsyncStorage. Solo el tema se persiste; no hay token ni sesión de servidor.

**¿Qué impide una URL con role=admin?** La ruta ignora esos parámetros y utiliza
el usuario validado del contexto. Eso no sustituye autorización de servidor.

**¿Por qué separar pantalla y ruta?** La ruta adapta navegación/estado; la vista
puede recibir props sin depender de cómo se llegó a ella.

## Fuentes y decisiones

- [Parámetros y estado de navegación en Expo Router](https://docs.expo.dev/router/reference/url-parameters/).
- [Stack y transiciones](https://docs.expo.dev/router/advanced/stack/).
- [TextInput, foco y submitBehavior](https://reactnative.dev/docs/textinput).
- Se eligió estado compartido más props para no duplicar datos personales en URLs.

Escribí **continuar** para la Parte 6: documentación final, rúbrica, pruebas y defensa.
