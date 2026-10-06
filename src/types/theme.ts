// src/types/theme.ts — Contratos del tema; solo se persiste la preferencia visual.
import type { TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  accent: string;
  border: string;
  error: string;
  success: string;
}
export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  shadow: ViewStyle;
}
export type TextVariant = 'title' | 'heading' | 'body' | 'caption' | 'eyebrow';
export type Typography = Record<TextVariant, TextStyle>;
export interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  isReady: boolean;
  storageError: string | null;
  toggleTheme: () => void;
}
