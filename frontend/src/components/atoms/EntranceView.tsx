/**
 * frontend/src/components/atoms/EntranceView.tsx
 * Anima la entrada del contenido y respeta la preferencia de movimiento reducido; no gestiona datos ni navegación.
 */
import { useEffect, useState, type PropsWithChildren } from 'react';
import { Animated, Platform, type StyleProp, type ViewStyle } from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface EntranceViewProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}
export function EntranceView({ children, style }: EntranceViewProps) {
  const [opacity] = useState(() => new Animated.Value(0));
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: reducedMotion ? 0 : 220,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion]);
  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}
