// src/components/molecules/InfoRow.tsx — Ícono y explicación breve reutilizados en login y bienvenida.
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';

interface InfoRowProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}
export function InfoRow({ icon, title, description }: InfoRowProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
        <Ionicons name={icon} size={22} color={theme.colors.primary} accessible={false} />
      </View>
      <View style={styles.text}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText variant="caption" tone="textSecondary">
          {description}
        </AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  icon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, minWidth: 0, gap: SPACING.xs },
  title: { fontWeight: '700' },
});
