// Las listas de ejemplo son horizontales para evitar virtualización anidada vertical.
import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import type { NativeComponentName } from '../../data/components';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from '../atoms/AppText';

type ListName = Extract<
  NativeComponentName,
  'ScrollView' | 'FlatList' | 'SectionList' | 'VirtualizedList'
>;
const LIST_ITEMS = Array.from({ length: 20 }, (_unusedItem, itemIndex) => ({
  id: String(itemIndex + 1),
  label: 'Elemento ' + (itemIndex + 1),
}));
const SECTIONS = [
  { title: 'Grupo A', data: LIST_ITEMS.slice(0, 3) },
  { title: 'Grupo B', data: LIST_ITEMS.slice(3, 6) },
];
function ListItem({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.item, { backgroundColor: theme.colors.primarySoft }]}>
      <AppText variant="caption" tone="primary" style={{ fontWeight: '700' }}>
        {label}
      </AppText>
    </View>
  );
}
export function ListPreview({ name }: { name: ListName }) {
  let list;
  switch (name) {
    case 'ScrollView':
      list = (
        <ScrollView horizontal contentContainerStyle={styles.items}>
          {LIST_ITEMS.slice(0, 6).map((item) => (
            <ListItem key={item.id} label={item.label} />
          ))}
        </ScrollView>
      );
      break;
    case 'FlatList':
      list = (
        <FlatList
          horizontal
          data={LIST_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem label={item.label} />}
          contentContainerStyle={styles.items}
        />
      );
      break;
    case 'SectionList':
      list = (
        <SectionList
          horizontal
          sections={SECTIONS}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <View style={styles.item}>
              <AppText variant="caption" tone="accent">
                {section.title}
              </AppText>
            </View>
          )}
          renderItem={({ item }) => <ListItem label={item.label} />}
          contentContainerStyle={styles.items}
        />
      );
      break;
    case 'VirtualizedList':
      list = (
        <VirtualizedList
          horizontal
          data={LIST_ITEMS}
          getItem={(data: typeof LIST_ITEMS, itemIndex: number) => {
            const item = data[itemIndex];
            if (!item)
              throw new RangeError('Índice fuera de la lista de ejemplo.');
            return item;
          }}
          getItemCount={(data: typeof LIST_ITEMS) => data.length}
          keyExtractor={(item: (typeof LIST_ITEMS)[number]) => item.id}
          renderItem={({ item }: { item: (typeof LIST_ITEMS)[number] }) => (
            <ListItem label={item.label} />
          )}
          contentContainerStyle={styles.items}
        />
      );
      break;
  }
  return (
    <View style={{ gap: 10 }}>
      <View style={{ height: 72 }}>{list}</View>
      <AppText variant="caption" tone="muted">
        Deslizá horizontalmente para recorrer la lista.
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  items: { gap: 8, paddingBottom: 10, alignItems: 'center' },
  item: {
    width: 116,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
