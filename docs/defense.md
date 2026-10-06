# Guía para defender el proyecto

## Presentación de un minuto

“Desarrollé un acceso de usuarios con React Native, Expo y TypeScript. La página
principal valida email y contraseña y envía un POST a Express. El backend usa
una cuenta SQL limitada, consulta por parámetros y compara con bcrypt. Si el
ingreso es correcto, devuelve datos públicos. La ruta valida el usuario y lo
pasa por props a la bienvenida. Separé presentación, estado y datos con Atomic
Design. El tema persiste; el usuario se mantiene solo en memoria. No implementé
una sesión con JWT ni un hosting público.”

Adaptar a lo que efectivamente puedas mostrar: no decir que ya se probó Expo Go
en Android/iOS para este proyecto si esas verificaciones siguen pendientes.

## Demostración de cinco minutos

1. **Preparación:** XAMPP habitual configurado, Express iniciado y Metro 8083.
   Health y un login HTTP deben funcionar antes de comenzar.
2. **Formulario:** mostrar validación de vacíos/email, visibilidad y foco.
3. **API real:** entrar con student@np.test; explicar que no hay comparación
   de una contraseña fija en el frontend.
4. **Props:** abrir app/welcome.tsx y src/types/auth.ts; señalar user y onLogout.
   Mostrar que WelcomePage renderiza desde sus argumentos, no desde la URL.
5. **Usabilidad:** alternar tema, desplazar bienvenida y volver arriba.
6. **Salida:** cerrar sesión, abrir /welcome sin usuario y comprobar la redirección.
7. **Modelo:** mostrar Mermaid en database.md y consulta parametrizada en userModel.ts.
8. **Cierre:** enseñar checklist de pendientes, evitando afirmar que es producción.

No detener MySQL durante una defensa si también lo usan otros trabajos.
Para demostrar errores, usar un entorno exclusivo o las evidencias ya registradas.

## Preguntas probables

### ¿Qué son las props?

Son entradas que un componente recibe de su padre: datos y callbacks. El hijo
las utiliza sin modificarlas. WelcomePage recibe user y onLogout tipados.
La explicación se corresponde con [props en React](https://react.dev/learn/passing-props-to-a-component).

### ¿Dónde cumplís “datos del usuario por props” si usás Expo Router?

Router gestiona la ruta, no props arbitrarias. app/welcome.tsx lee el estado
compartido, lo valida con parseUser y renderiza WelcomePage con user y onLogout.
El contexto transporta el estado; la vista recibe los datos por props.

### ¿Por qué no pasás el usuario por parámetros?

La consigna permite estado compartido. Evito duplicar nombre/email en la URL,
que puede quedar en historial y registros. No confío en role=admin de una URL.
La contraseña no se envía por rutas en ningún caso.

### ¿Cuál es el recorrido completo del dato?

LoginForm → useLoginForm → AuthProvider.signIn → authService → POST Express →
middleware de validación → modelo SQL → bcrypt.compare → log confirmado →
JSON público → validación runtime → AuthContext.user → ruta → props de bienvenida.

### ¿Por qué TypeScript estricto no alcanza para validar el JSON?

Los tipos se verifican durante desarrollo/compilación. Una respuesta HTTP puede
ser cualquier dato en ejecución: entra como unknown y los guards comprueban
tipos, fechas y campos antes de copiar un User público.

### ¿Qué diferencia hay entre props, estado y contexto?

Props son entradas del padre; estado conserva cambios de un componente; contexto
comparte información entre descendientes sin pasarla por cada nivel. Uso contexto
para tema/usuario y props para la bienvenida.

### ¿Por qué validar en cliente y servidor?

Cliente da feedback rápido. Servidor es obligatorio porque un atacante puede
llamar la API sin la interfaz. Ambos revisan vacíos, email y límites de password.

### ¿Por qué POST y no GET?

La operación recibe credenciales en JSON, no en la URL que puede persistir en
historial/logs. POST no cifra el cuerpo: fuera del desarrollo local se necesita HTTPS.

### ¿Qué es una consulta parametrizada?

La instrucción SQL y los valores se entregan separados. En findUserByEmail el
email reemplaza el marcador ? como dato, no como SQL ejecutable. No concateno
el email a la consulta.

### ¿Por qué hay CONCAT en el script de creación de la cuenta SQL?

Es provisionamiento administrativo controlado con QUOTE para definir la cuenta,
no la consulta del login ni un endpoint. El backend nunca ejecuta ese script.
Las consultas con credenciales de usuarios sí usan execute con parámetros.

### ¿Un hash es cifrado? ¿Para qué sirve el salt?

No es cifrado reversible. bcrypt aplica un algoritmo costoso con salt aleatorio,
de modo que dos contraseñas iguales no necesitan producir el mismo hash.
compare comprueba una contraseña contra el hash; no recupera el texto original.

### ¿Por qué el máximo de 72 bytes y no 72 caracteres?

bcrypt limita la entrada a 72 bytes. Unicode puede usar varios bytes por carácter.
El proyecto limita UTF-8 para no comparar solo un prefijo de una contraseña larga.
El mínimo académico es 8 caracteres; no es una política completa de producción.

### ¿Por qué el mismo 401 para inexistente, incorrecta e inactiva?

Evita revelar directamente qué cuentas existen. También se compara con un hash
ficticio si no se encontró la cuenta. Reduce diferencias evidentes de tiempo,
pero no promete tiempo constante ni elimina todos los canales de enumeración.

### ¿Qué significa cada código HTTP importante?

200: operación correcta; 400: datos inválidos; 401: credenciales rechazadas;
429: demasiados intentos; 500: falla interna genérica. Red/timeout del cliente
pueden no tener respuesta HTTP y se comunican por separado.

### ¿Qué es CORS? ¿Impide que alguien use curl?

Es una política de acceso de navegadores según el origen, no autenticación.
La API permite orígenes web exactos y solicitudes nativas sin Origin.
No protege endpoints sensibles de un cliente directo: eso requiere autorización.

### ¿Para qué sirven Helmet y rate limiting?

Helmet configura cabeceras de seguridad. El limiter limita POST por IP para
reducir abuso. No sustituyen bcrypt, SQL parametrizado, validación ni autorización.
El contador es memoria del proceso; reiniciarlo lo borra.

### ¿Por qué no usás root para el backend?

Menor privilegio: una cuenta dedicada puede leer las columnas necesarias e
insertar logs, pero no editar usuarios, borrar tablas ni conceder permisos.
Una credencial administrativa solo se usa localmente para importar/provisionar.

### ¿Cómo llegaste a 3FN?

Primero una tabla con roles y grupos repetidos de intentos. En 1FN, valores
atómicos; en 2FN, separar atributos dependientes solo de parte de una clave
compuesta; en 3FN, separar el rol para quitar dependencia transitiva.
Resultado: users referencia roles y login_logs referencia users.
Las etapas y dependencias concretas están en database.md.

### ¿Por qué lastLoginAt no está duplicado en users?

Se deriva como MAX(attempted_at) de eventos exitosos. Mantenerlo también en users
podría generar inconsistencias. INSERT y cálculo se confirman en una transacción.

### ¿Todos los requests crean un log?

No. Se registran comparaciones de credenciales realizadas. Validación rechazada,
CORS rechazado y 429 no generan un intento de autenticación comparado. Un email
inexistente sí se compara con hash ficticio y guarda user_id NULL.

### ¿Por qué health puede dar 200 con MySQL apagado?

Es liveness del servidor Express, no readiness SQL. Un login prueba una operación
real y devuelve 500 genérico si no puede consultar o guardar su evento.

### ¿Qué guardás en AsyncStorage?

Solo light/dark. No password, hash, usuario ni token. Si se recarga o se cierra
la aplicación, debe volver a ingresar. AsyncStorage no es almacenamiento de secretos.

### ¿Qué evita un login tardío después de cerrar sesión?

signOut cancela la petición y limpia el usuario. Antes de aplicar la respuesta,
AuthProvider comprueba montaje, identidad de la petición y señal de cancelación.
Una respuesta vieja no debe restaurar el usuario.

### ¿Cómo funcionará en mi teléfono si la API está en la PC?

Web usa localhost; emulador Android estándar 10.0.2.2; celular físico la IP LAN
de la PC, misma red y puerto permitido. localhost en el teléfono no es la PC.
Metro y Express son servicios distintos; el túnel de Expo no publica esta API.

### ¿Por qué EXPO_PUBLIC_API_URL no puede guardar un secreto?

Expo incorpora variables EXPO_PUBLIC_* al código distribuido. La URL es pública;
las credenciales SQL están solo en backend/.env ignorado.
Referencia: [entorno de Expo](https://docs.expo.dev/guides/environment-variables/).

### ¿Qué es Atomic Design aquí?

Atoms: Input/Button/texto; molecules: TextField con etiqueta y error; organisms:
LoginForm/ScreenShell; pages: vistas completas. El servicio HTTP y los contexts
quedan separados de esos bloques visuales.

### ¿Cómo resolvés responsive y accesibilidad?

useWindowDimensions, breakpoints, flexbox, maxWidth, textos sin altura fija y
safe areas. Las acciones tienen etiquetas/roles y al menos 44 puntos táctiles.
Scroll y entrada respetan movimiento reducido. VoiceOver/TalkBack y teclado
nativo todavía requieren comprobación real.

### ¿Por qué el botón de scroll no aparece siempre?

useScrollToTop exige contenido mayor al viewport y offset >240. onScroll,
onLayout y onContentSizeChange actualizan las condiciones. El fade oculta también
interacción/accesibilidad; scrollTo vuelve al inicio.

### ¿Es un sistema de autenticación listo para producción?

No. Valida credenciales y muestra datos, pero no emite una sesión verificable
para futuras rutas. Faltan HTTPS, autorización/JWT, almacenamiento adecuado,
retención de logs, gestión de usuarios, configuración de infraestructura y más
pruebas. JWT y SecureStore se mencionan sin implementarlos fuera del alcance.

### ¿Qué validaste y qué no?

SQL/API aislados, servicio y flujo web real; lint, TypeScript y bundles.
No se probó el proyecto 3 en teléfonos, no se configuró la contraseña del XAMPP
habitual ni se publicó GitHub/hosting. Los resultados están separados del plan.

## Archivos para señalar sin memorizar todo

- app/welcome.tsx y src/types/auth.ts: requisito de props.
- src/components/organisms/LoginForm.tsx y hooks/useLoginForm.ts: interfaz/lógica.
- src/services/authService.ts y utils/responseGuards.ts: red y confianza del JSON.
- backend/controllers/authController.ts: comparación y respuesta pública.
- backend/models/userModel.ts: SQL parametrizado y transacción.
- backend/database/schema.sql y docs/database.md: relaciones y normalización.
- src/context/ThemeContext.tsx y hooks/useScrollToTop.ts: usabilidad.
- docs/rubric.md y docs/testing.md: evidencia y límites.
