// src/styles/theme.ts — Compone dos temas estables a partir de los tokens compartidos.
import type { AppTheme } from '@/types/theme';
import { DARK_COLORS, LIGHT_COLORS } from './colors';
import { DARK_SHADOW, LIGHT_SHADOW } from './shadows';

export const THEMES: Record<'light' | 'dark', AppTheme> = {
  light: { mode: 'light', colors: LIGHT_COLORS, shadow: LIGHT_SHADOW },
  dark: { mode: 'dark', colors: DARK_COLORS, shadow: DARK_SHADOW },
};
