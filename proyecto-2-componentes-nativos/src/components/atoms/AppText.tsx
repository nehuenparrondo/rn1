// src/components/atoms/AppText.tsx
// Texto accesible con jerarquía tipográfica y colores del tema global.
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

interface AppTextProps extends TextProps {
  variant?: 'body' | 'title' | 'subtitle' | 'eyebrow' | 'caption';
  tone?: 'default' | 'muted' | 'primary' | 'accent';
}

export function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();
  const color =
    tone === 'muted'
      ? theme.colors.textSecondary
      : tone === 'primary'
        ? theme.colors.primary
        : tone === 'accent'
          ? theme.colors.accent
          : theme.colors.text;
  return (
    <Text {...props} style={[styles.base, styles[variant], { color }, style]} />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily:
      Platform.OS === 'web' ? 'Inter, system-ui, sans-serif' : undefined,
  },
  body: { fontSize: 16, lineHeight: 26 },
  title: { fontSize: 32, lineHeight: 39, fontWeight: '800', letterSpacing: -1 },
  subtitle: {
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.8,
  },
  caption: { fontSize: 13, lineHeight: 21 },
});
