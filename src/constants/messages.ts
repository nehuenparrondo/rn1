// src/constants/messages.ts — Mensajes públicos centralizados para el formulario y la red.
export const MESSAGES = {
  emailRequired: 'Ingresá tu email.',
  emailInvalid: 'Ingresá un email válido de hasta 254 caracteres.',
  passwordRequired: 'Ingresá tu contraseña.',
  passwordShort: 'La contraseña debe tener al menos 8 caracteres.',
  passwordLong: 'La contraseña no puede superar 72 bytes en UTF-8.',
  credentials: 'Credenciales incorrectas',
  rateLimit: 'Demasiados intentos. Esperá un momento y volvé a intentar.',
  server: 'No se pudo completar la solicitud. Intentá nuevamente.',
  network: 'No pudimos conectar con el servidor. Revisá tu conexión y la API.',
  timeout: 'El servidor tardó demasiado. Intentá nuevamente.',
  invalidResponse: 'El servidor devolvió una respuesta no válida.',
  configuration: 'Revisá EXPO_PUBLIC_API_URL: debe ser el origen HTTP/HTTPS de la API.',
  cancelled: 'La solicitud fue cancelada.',
  busy: 'Ya hay una solicitud de ingreso en curso.',
  themeStorage: 'El tema se cambió, pero no se pudo guardar en este dispositivo.',
  themeRead: 'No se pudo leer el tema guardado. Se usará el del sistema.',
} as const;
