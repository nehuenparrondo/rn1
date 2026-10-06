// src/constants/app.ts — Claves y medidas comunes sin secretos ni estilos dispersos.
export const THEME_STORAGE_KEY = '@np-user-access/theme-v1';
export const API_TIMEOUT_MS = 10000;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_BYTES = 72;
export const MAX_EMAIL_LENGTH = 254;
export const SCROLL_TOP_THRESHOLD = 240;
export const SCROLL_EVENT_THROTTLE = 16;
export const FLOATING_BUTTON_SIZE = 56;
export const FLOATING_BUTTON_GAP = 12;
export const FLOATING_EDGE = 16;
export const FLOATING_CONTENT_SPACE = 160;
export const ROUTES = { login: '/', welcome: '/welcome' } as const;
