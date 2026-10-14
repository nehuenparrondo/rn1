// src/styles/theme.ts
// Construye los temas claro y oscuro utilizados por ThemeContext.

import { DARK_COLORS, LIGHT_COLORS } from './colors';
import type { AppTheme } from '../types/theme';

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: LIGHT_COLORS,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: DARK_COLORS,
};
