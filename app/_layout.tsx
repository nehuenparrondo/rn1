// app/_layout.tsx — Providers globales, status bar y tema flotante compartido por las rutas.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { ThemeToggleButton } from '@/components/atoms/ThemeToggleButton';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { RADIUS, SPACING } from '@/styles/spacing';

function RootNavigator() {
  const { mode, theme, isReady, storageError } = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {isReady ? (
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: reducedMotion ? 'none' : 'fade',
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          />
          {storageError && (
            <View
              style={[
                styles.notice,
                { backgroundColor: theme.colors.surface, top: insets.top + SPACING.md },
              ]}
            >
              <AppText variant="caption" tone="error" accessibilityLiveRegion="polite">
                {storageError}
              </AppText>
            </View>
          )}
          <ThemeToggleButton />
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator
            color={theme.colors.primary}
            accessibilityLabel="Cargando tema"
          />
        </View>
      )}
    </View>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notice: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    zIndex: 30,
  },
});
