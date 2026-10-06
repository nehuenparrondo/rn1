// src/components/atoms/ScrollToTopButton.tsx — Fade del botón de scroll, encima del control de tema.
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FLOATING_BUTTON_GAP,
  FLOATING_BUTTON_SIZE,
  FLOATING_EDGE,
} from '@/constants/app';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS } from '@/styles/spacing';
import { IconButton } from './IconButton';

interface ScrollToTopButtonProps {
  visible: boolean;
  onPress: () => void;
}
export function ScrollToTopButton({ visible, onPress }: ScrollToTopButtonProps) {
  const [opacity] = useState(() => new Animated.Value(0));
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: reducedMotion ? 0 : 180,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [opacity, visible, reducedMotion]);
  return (
    <Animated.View
      aria-hidden={!visible}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={[
        styles.position,
        theme.shadow,
        {
          pointerEvents: visible ? 'auto' : 'none',
          opacity,
          right: Math.max(insets.right, FLOATING_EDGE),
          bottom:
            insets.bottom + FLOATING_EDGE + FLOATING_BUTTON_SIZE + FLOATING_BUTTON_GAP,
        },
      ]}
    >
      <IconButton
        icon="arrow-up-outline"
        label="Volver arriba"
        disabled={!visible}
        onPress={onPress}
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  position: { position: 'absolute', zIndex: 10, borderRadius: RADIUS.md },
});
