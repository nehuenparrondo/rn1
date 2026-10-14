// Vista completa del catálogo; las rutas se mantienen separadas de la interfaz.
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { COMPONENT_COUNT, COMPONENT_GROUPS } from '../data/components';
import { useTheme } from '../hooks/useTheme';
import { AppText } from '../components/atoms/AppText';
import { ComponentCard } from '../components/organisms/ComponentCard';
import { CatalogTemplate } from '../components/templates/CatalogTemplate';

export function ComponentsPage() {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const columnCount = width >= 900 ? 2 : 1;
  return (
    <CatalogTemplate>
      <View style={{ gap: 16 }}>
        <AppText variant="eyebrow" tone="primary">
          REACT NATIVE · TYPESCRIPT
        </AppText>
        <AppText
          accessibilityRole="header"
          style={{
            fontSize: width < 600 ? 38 : 62,
            lineHeight: width < 600 ? 44 : 70,
            fontWeight: '900',
            letterSpacing: -1.6,
          }}
        >
          Conocé los{'\n'}
          <AppText
            style={{
              fontSize: width < 600 ? 38 : 62,
              lineHeight: width < 600 ? 44 : 70,
              fontWeight: '900',
            }}
            tone="primary"
          >
            componentes nativos.
          </AppText>
        </AppText>
        <AppText tone="muted" style={{ maxWidth: 660 }}>
          Qué hace cada componente, para qué se usa y un ejemplo que podés
          probar.
        </AppText>
        <View style={[styles.summary, { borderColor: theme.colors.border }]}>
          <AppText variant="caption" tone="accent">
            {COMPONENT_COUNT} componentes
          </AppText>
          <AppText variant="caption" tone="muted">
            Ejemplos interactivos
          </AppText>
          <AppText variant="caption" tone="muted">
            React Native 0.86 · Expo 57
          </AppText>
        </View>
      </View>
      {COMPONENT_GROUPS.map((group, groupIndex) => {
        const firstNumber =
          COMPONENT_GROUPS.slice(0, groupIndex).reduce(
            (total, previousGroup) => total + previousGroup.items.length,
            0,
          ) + 1;
        return (
          <View key={group.title} style={{ gap: 20 }}>
            <View style={{ gap: 4 }}>
              <AppText variant="eyebrow" tone="primary">
                SECCIÓN {String(groupIndex + 1).padStart(2, '0')}
              </AppText>
              <AppText
                accessibilityRole="header"
                variant="subtitle"
                style={{ fontSize: 25, lineHeight: 33 }}
              >
                {group.title}
              </AppText>
              <AppText tone="muted" variant="caption">
                {group.subtitle}
              </AppText>
            </View>
            <View style={styles.grid}>
              {group.items.map((entry, entryIndex) => (
                <View
                  key={entry.name}
                  style={{ width: columnCount === 2 ? '48.8%' : '100%' }}
                >
                  <ComponentCard
                    entry={entry}
                    number={firstNumber + entryIndex}
                  />
                </View>
              ))}
            </View>
          </View>
        );
      })}
      <AppText variant="caption" tone="muted">
        Los componentes exclusivos de Android o iOS se ejecutan en su
        plataforma. Los obsoletos están señalados. No se incluyen APIs ni
        componentes internos experimentales.
      </AppText>
    </CatalogTemplate>
  );
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    borderTopWidth: 1,
    paddingTop: 18,
    marginTop: 4,
  },
});
