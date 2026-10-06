// src/styles/breakpoints.ts — Clasifica el ancho; la altura sigue disponible para rotación.
export const BREAKPOINTS = { tablet: 768, desktop: 1100 } as const;
export const CONTENT_MAX_WIDTH = 1120;
export const FORM_MAX_WIDTH = 480;

export function getBreakpoint(width: number) {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}
