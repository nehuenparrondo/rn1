// src/components/atoms/Input.tsx — Input nativo controlado con foco y validación visual.
import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';
import { TYPOGRAPHY } from '@/styles/typography';

export interface InputProps extends TextInputProps {
  ref?: Ref<TextInput>;
  invalid?: boolean;
  valid?: boolean;
}
export function Input({
  ref,
  invalid = false,
  valid = false,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = invalid
    ? theme.colors.error
    : focused
      ? theme.colors.accent
      : valid
        ? theme.colors.success
        : theme.colors.border;
  return (
    <TextInput
      {...props}
      ref={ref}
      placeholderTextColor={theme.colors.textSecondary}
      underlineColorAndroid="transparent"
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={[
        TYPOGRAPHY.body,
        styles.input,
        {
          color: theme.colors.text,
          backgroundColor: theme.colors.surfaceSecondary,
          borderColor,
        },
        style,
      ]}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderRadius: RADIUS.sm,
  },
});
