// src/components/atoms/Card.tsx — Superficie flexible que no impone tamaños a su contenido.
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';

export function Card({ style, ...props }: ViewProps) {
  const { theme } = useTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        theme.shadow,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style,
      ]}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    width: '100%',
    minWidth: 0,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
});
