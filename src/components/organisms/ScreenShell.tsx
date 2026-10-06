// src/components/organisms/ScreenShell.tsx — Safe areas, teclado y scroll reutilizables para ambas pantallas.
import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton';
import { FLOATING_CONTENT_SPACE, SCROLL_EVENT_THROTTLE } from '@/constants/app';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useTheme } from '@/hooks/useTheme';
import { CONTENT_MAX_WIDTH } from '@/styles/breakpoints';
import { SPACING } from '@/styles/spacing';

interface ScreenShellProps extends PropsWithChildren {
  contentStyle?: StyleProp<ViewStyle>;
}
export function ScreenShell({ children, contentStyle }: ScreenShellProps) {
  const { theme } = useTheme();
  const { isMobile } = useBreakpoint();
  const keyboardVisible = useKeyboardVisible();
  const { scrollRef, isVisible, onScroll, onLayout, onContentSizeChange, scrollToTop } =
    useScrollToTop();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          onLayout={onLayout}
          onContentSizeChange={onContentSizeChange}
          scrollEventThrottle={SCROLL_EVENT_THROTTLE}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: isMobile ? SPACING.lg : SPACING.xxl },
          ]}
        >
          <View style={[styles.content, contentStyle]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ScrollToTopButton visible={isVisible && !keyboardVisible} onPress={scrollToTop} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: FLOATING_CONTENT_SPACE,
  },
  content: { flexGrow: 1, width: '100%', maxWidth: CONTENT_MAX_WIDTH, gap: SPACING.xl },
});
