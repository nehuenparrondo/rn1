// src/styles/colors.ts — Paleta violeta/fucsia con texto de contraste en ambos modos.
import type { ThemeColors } from '@/types/theme';

export const LIGHT_COLORS: ThemeColors = {
  background: '#FAF5FC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1E7F7',
  text: '#24112D',
  textSecondary: '#65516D',
  primary: '#B71963',
  onPrimary: '#FFFFFF',
  primarySoft: '#FCE5F0',
  accent: '#6D28D9',
  border: '#937C9E',
  error: '#B42342',
  success: '#167345',
};
export const DARK_COLORS: ThemeColors = {
  background: '#0C0711',
  surface: '#1C1023',
  surfaceSecondary: '#2C1835',
  text: '#FFF7FC',
  textSecondary: '#C8B3C7',
  primary: '#FF4795',
  onPrimary: '#240C1A',
  primarySoft: '#39152B',
  accent: '#BC8CFF',
  border: '#8C6998',
  error: '#FF9BAB',
  success: '#68E3A6',
};
