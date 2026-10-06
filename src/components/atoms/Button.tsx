// src/components/atoms/Button.tsx — Acción accesible con bloqueo y spinner durante el envío.
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';
import { TYPOGRAPHY } from '@/styles/typography';

interface ButtonProps {
  label: string;
  onPress: PressableProps['onPress'];
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
}
export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  accessibilityLabel,
}: ButtonProps) {
  const { theme } = useTheme();
  const blocked = disabled || loading;
  const color = variant === 'primary' ? theme.colors.onPrimary : theme.colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            variant === 'primary' ? theme.colors.primary : theme.colors.surfaceSecondary,
          borderColor: variant === 'primary' ? theme.colors.primary : theme.colors.border,
        },
        blocked && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading && (
        <ActivityIndicator color={color} accessibilityLabel="Consultando la API" />
      )}
      <Text style={[TYPOGRAPHY.body, styles.label, { color }]}>
        {loading ? 'Ingresando…' : label}
      </Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    width: '100%',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  label: { fontWeight: '700', flexShrink: 1, textAlign: 'center' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.6 },
});
