/**
 * frontend/src/hooks/useReducedMotion.ts
 * Consulta y observa la preferencia de accesibilidad para que las animaciones puedan desactivarse.
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    let active = true;
    let changed = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active && !changed) setReducedMotion(enabled);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        changed = true;
        setReducedMotion(enabled);
      },
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reducedMotion;
}
