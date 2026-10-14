// Control flotante animado, oculto para los lectores de pantalla cuando no se usa.
import { useEffect, useState } from 'react';
import { Animated, Platform } from 'react-native';
import { IconButton } from '../atoms/IconButton';

interface ScrollToTopButtonProps {
  visible: boolean;
  reduceMotion: boolean;
  onPress: () => void;
  bottom: number;
  right: number;
}

export function ScrollToTopButton({
  visible,
  reduceMotion,
  onPress,
  bottom,
  right,
}: ScrollToTopButtonProps) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: reduceMotion ? 0 : 180,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduceMotion, visible]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      aria-hidden={!visible}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
      style={{
        position: 'absolute',
        right,
        bottom,
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      }}
    >
      <IconButton
        iconName="arrow-up-outline"
        label="Volver arriba"
        onPress={onPress}
        disabled={!visible}
        primary
      />
    </Animated.View>
  );
}
