// src/styles/colors.ts
// Paleta violeta y fucsia compartida por toda la interfaz.

export const LIGHT_COLORS = {
  background: '#FAF6FC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0E6F5',
  text: '#241329',
  textSecondary: '#705C78',
  primary: '#C41263',
  primarySoft: '#FBE1EE',
  accent: '#7948CC',
  onPrimary: '#FFFFFF',
  border: '#E4D5EA',
  shadow: '#36163D',
  error: '#DC2626',
  success: '#237B4B',
} as const;

export const DARK_COLORS = {
  background: '#0C0810',
  surface: '#1A101F',
  surfaceSecondary: '#25172D',
  text: '#FFF4FC',
  textSecondary: '#BAA6C3',
  primary: '#FF4795',
  primarySoft: '#361329',
  accent: '#B38AFF',
  onPrimary: '#230817',
  border: '#42243D',
  shadow: '#000000',
  error: '#FDA4AF',
  success: '#4ADE80',
} as const;
