// Tarjeta didáctica con descripción, ejemplo y propiedades de un componente.
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { ComponentEntry } from '../../data/components';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../atoms/AppText';
import { ComponentPreview } from './ComponentPreview';

interface ComponentCardProps {
  entry: ComponentEntry;
  number: number;
}
export function ComponentCard({ entry, number }: ComponentCardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.heading}>
        <AppText
          variant="caption"
          tone="primary"
          style={[styles.number, { backgroundColor: theme.colors.primarySoft }]}
        >
          {String(number).padStart(2, '0')}
        </AppText>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText accessibilityRole="header" style={styles.name}>
            {entry.name}
          </AppText>
          <AppText variant="caption" tone="muted">
            {entry.platform ?? 'Android · iOS · Web'}
          </AppText>
        </View>
      </View>
      <AppText tone="muted">{entry.description}</AppText>
      <AppText variant="caption">
        <AppText variant="caption" style={{ fontWeight: '700' }}>
          Para qué se usa:{' '}
        </AppText>
        {entry.useCase}
      </AppText>
      {entry.legacy && (
        <AppText variant="caption" tone="accent">
          {entry.legacy}
        </AppText>
      )}
      <View
        style={[
          styles.preview,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <AppText variant="eyebrow" tone="muted">
          EJEMPLO
        </AppText>
        <ComponentPreview name={entry.name} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        <AppText
          variant="caption"
          tone="accent"
          style={{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}
        >
          {entry.code}
        </AppText>
      </ScrollView>
      <AppText variant="caption" tone="muted">
        {entry.props}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, padding: 22, gap: 14, flex: 1 },
  heading: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  number: {
    width: 38,
    height: 38,
    textAlign: 'center',
    lineHeight: 38,
    borderRadius: 12,
    fontWeight: '700',
  },
  name: { fontSize: 19, lineHeight: 27, fontWeight: '800', flexShrink: 1 },
  preview: {
    minHeight: 132,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    justifyContent: 'center',
  },
});
