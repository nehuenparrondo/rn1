// src/components/molecules/UserDetailRow.tsx — Etiqueta y dato público que se ajustan al ancho disponible.
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { SPACING } from '@/styles/spacing';

interface UserDetailRowProps {
  label: string;
  value: string;
}
export function UserDetailRow({ label, value }: UserDetailRowProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.border }]}>
      <AppText variant="caption" tone="textSecondary">
        {label}
      </AppText>
      <AppText selectable style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  value: { fontWeight: '600', flexShrink: 1 },
});
