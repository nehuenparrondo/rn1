// Control flotante etiquetado y con un área táctil cómoda.
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

interface IconButtonProps {
  iconName: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}

export function IconButton({
  iconName,
  label,
  onPress,
  primary = false,
  disabled = false,
}: IconButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary
            ? theme.colors.primary
            : theme.colors.surface,
          borderColor: primary ? theme.colors.primary : theme.colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          boxShadow: '0px 6px 22px ' + theme.colors.shadow + '40',
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={23}
        color={primary ? theme.colors.onPrimary : theme.colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
