/**
 * frontend/src/hooks/useTheme.ts
 * Entrega el tema y su operación de cambio. Lanza un error claro si falta ThemeProvider.
 */
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider.');
  return context;
}
