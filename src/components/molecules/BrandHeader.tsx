// src/components/molecules/BrandHeader.tsx — Identidad compartida sin añadir acciones de navegación.
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';

export function BrandHeader() {
  const { theme } = useTheme();
  return (
    <View style={styles.header}>
      <View
        accessible={false}
        style={[styles.logo, { backgroundColor: theme.colors.primary }]}
      >
        <AppText style={[styles.logoText, { color: theme.colors.onPrimary }]}>
          NP.
        </AppText>
      </View>
      <View style={styles.text}>
        <AppText variant="heading">Acceso.</AppText>
        <AppText variant="caption" tone="textSecondary">
          Tu espacio, a un paso.
        </AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  logo: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontWeight: '900' },
  text: { flex: 1, minWidth: 0 },
});
