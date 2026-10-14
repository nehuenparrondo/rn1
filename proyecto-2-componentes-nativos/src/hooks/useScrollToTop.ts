// Muestra el control después de desplazarse y respeta la reducción de movimiento.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from 'react-native';

export function useScrollToTop() {
  const scrollRef = useRef<ScrollView>(null);
  const visibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let isActive = true;
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isActive) setReduceMotion(enabled);
      })
      .catch(() => {});
    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const shouldShow = event.nativeEvent.contentOffset.y > 250;
      if (shouldShow !== visibleRef.current) {
        visibleRef.current = shouldShow;
        setIsVisible(shouldShow);
      }
    },
    [],
  );

  const scrollToTop = useCallback(() => {
    Keyboard.dismiss();
    scrollRef.current?.scrollTo({ y: 0, animated: !reduceMotion });
  }, [reduceMotion]);

  return { scrollRef, isVisible, reduceMotion, handleScroll, scrollToTop };
}
