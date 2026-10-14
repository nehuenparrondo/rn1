// src/types/theme.ts
// Define los tipos utilizados por el sistema de temas de la aplicación.

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  primary: string;
  primarySoft: string;
  accent: string;
  onPrimary: string;
  border: string;
  shadow: string;
  error: string;
  success: string;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
}
