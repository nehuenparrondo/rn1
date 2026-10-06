// src/components/atoms/AppText.tsx — Texto tematizado con jerarquía y escalado accesible.
import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TYPOGRAPHY } from '@/styles/typography';
import type { TextVariant } from '@/types/theme';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: 'text' | 'textSecondary' | 'primary' | 'accent' | 'error' | 'success';
}
export function AppText({
  variant = 'body',
  tone = 'text',
  style,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();
  return (
    <Text
      {...props}
      style={[TYPOGRAPHY[variant], { color: theme.colors[tone] }, style]}
    />
  );
}
