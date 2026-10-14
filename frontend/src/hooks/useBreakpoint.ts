/**
 * frontend/src/hooks/useBreakpoint.ts
 * Usa el ancho actual de la ventana para distinguir móvil, tablet y escritorio, incluso al rotar el dispositivo.
 */
import { useWindowDimensions } from 'react-native';
import { getBreakpoint } from '@/styles/breakpoints';

export function useBreakpoint() {
  const { width, height, fontScale } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);
  return {
    width,
    height,
    fontScale,
    breakpoint,
    isLandscape: width > height,
    isDesktop: breakpoint === 'desktop',
    isMobile: breakpoint === 'mobile',
  };
}
