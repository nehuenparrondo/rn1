// src/hooks/useBreakpoint.ts — Recalcula layout al cambiar tamaño u orientación.
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
