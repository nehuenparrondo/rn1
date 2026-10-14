/**
 * frontend/src/components/molecules/FormNotice.tsx
 * Recibe un mensaje y su tono visual; anuncia errores o confirmaciones con atributos de accesibilidad.
 */
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';

interface FormNoticeProps {
  message: string;
  tone?: 'error' | 'success';
}
export function FormNotice({ message, tone = 'error' }: FormNoticeProps) {
  const { theme } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.notice,
        { backgroundColor: theme.colors.primarySoft, borderColor: theme.colors[tone] },
      ]}
    >
      <AppText variant="caption" tone={tone}>
        {message}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  notice: { borderWidth: 1, borderRadius: RADIUS.sm, padding: SPACING.md },
});
