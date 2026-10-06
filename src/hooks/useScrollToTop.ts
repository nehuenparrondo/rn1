// src/hooks/useScrollToTop.ts — Muestra el control solo con contenido desplazable y umbral superado.
import { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SCROLL_TOP_THRESHOLD } from '@/constants/app';
import { useReducedMotion } from './useReducedMotion';

export function useScrollToTop() {
  const scrollRef = useRef<ScrollView>(null);
  const dimensions = useRef({ contentHeight: 0, viewportHeight: 0, offset: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const refresh = useCallback(() => {
    const { contentHeight, viewportHeight, offset } = dimensions.current;
    setIsVisible(contentHeight > viewportHeight + 1 && offset > SCROLL_TOP_THRESHOLD);
  }, []);
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      dimensions.current.offset = Math.max(0, event.nativeEvent.contentOffset.y);
      refresh();
    },
    [refresh],
  );
  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      dimensions.current.contentHeight = height;
      refresh();
    },
    [refresh],
  );
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      dimensions.current.viewportHeight = event.nativeEvent.layout.height;
      refresh();
    },
    [refresh],
  );
  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });
  }, [reducedMotion]);
  return { scrollRef, isVisible, onScroll, onLayout, onContentSizeChange, scrollToTop };
}
