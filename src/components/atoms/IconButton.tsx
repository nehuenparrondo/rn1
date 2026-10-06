// src/components/atoms/IconButton.tsx — Ícono táctil con etiqueta obligatoria y área mínima de 44 puntos.
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS } from '@/styles/spacing';

interface IconButtonProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  selected?: boolean;
  size?: 44 | 56;
  variant?: 'primary' | 'quiet';
}
export function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  selected,
  size = 56,
  variant = 'primary',
}: IconButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderColor: variant === 'primary' ? theme.colors.primary : theme.colors.border,
          backgroundColor:
            variant === 'primary' ? theme.colors.primary : theme.colors.surfaceSecondary,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={variant === 'primary' ? theme.colors.onPrimary : theme.colors.text}
        accessible={false}
      />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.94 }] },
  disabled: { opacity: 0.5 },
});
