// Estructura responsive con áreas seguras y control persistente de tema.
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { AppText } from '../atoms/AppText';
import { IconButton } from '../atoms/IconButton';
import { ScrollToTopButton } from '../molecules/ScrollToTopButton';

export function CatalogTemplate({ children }: PropsWithChildren) {
  const { theme, themeMode, toggleTheme, isThemeReady, storageError } =
    useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const horizontalPadding = width < 768 ? 20 : 44;
  const { scrollRef, isVisible, reduceMotion, handleScroll, scrollToTop } =
    useScrollToTop();
  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.header,
          {
            borderColor: theme.colors.border,
            paddingTop: insets.top + 16,
            paddingLeft: Math.max(insets.left, horizontalPadding),
            paddingRight: Math.max(insets.right, horizontalPadding),
          },
        ]}
      >
        <View style={styles.brand}>
          <View
            style={[styles.mark, { backgroundColor: theme.colors.primary }]}
          >
            <AppText
              style={{
                color: theme.colors.onPrimary,
                fontWeight: '900',
                fontSize: 21,
              }}
            >
              NP
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontWeight: '800', fontSize: 17 }}>
              Componentes nativos.
            </AppText>
            <AppText variant="caption" tone="muted">
              PROYECTO 02
            </AppText>
          </View>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingTop: 38,
          paddingBottom: insets.bottom + 160,
          paddingLeft: Math.max(insets.left, horizontalPadding),
          paddingRight: Math.max(insets.right, horizontalPadding),
        }}
      >
        <View style={styles.content}>
          {storageError && (
            <AppText
              accessibilityRole="alert"
              style={{ color: theme.colors.error }}
            >
              {storageError}
            </AppText>
          )}
          {children}
        </View>
      </ScrollView>
      <View
        style={[
          styles.themeControl,
          { bottom: insets.bottom + 84, right: insets.right + 20 },
        ]}
      >
        <IconButton
          iconName={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
          label={
            themeMode === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'
          }
          onPress={toggleTheme}
          disabled={!isThemeReady}
          primary
        />
      </View>
      <ScrollToTopButton
        visible={isVisible}
        reduceMotion={reduceMotion}
        onPress={scrollToTop}
        bottom={insets.bottom + 20}
        right={insets.right + 20}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, minHeight: 0 },
  themeControl: { position: 'absolute' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  mark: {
    width: 44,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { width: '100%', maxWidth: 1140, alignSelf: 'center', gap: 38 },
});
