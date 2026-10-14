// Actualización simulada con temporizador cancelable y gesto nativo de recarga.
import { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../atoms/ActionButton';
import { AppText } from '../atoms/AppText';
import { DemoDialog } from '../molecules/DemoDialog';

export function RefreshPreview() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (pendingTimer.current !== null) clearTimeout(pendingTimer.current);
    },
    [],
  );
  function refresh() {
    if (pendingTimer.current !== null) return;
    setRefreshing(true);
    pendingTimer.current = setTimeout(() => {
      setRefreshCount((currentCount) => currentCount + 1);
      setRefreshing(false);
      pendingTimer.current = null;
    }, 1000);
  }
  return (
    <>
      <ActionButton
        label="Probar actualización"
        onPress={() => setVisible(true)}
      />
      <DemoDialog
        visible={visible}
        onClose={() => setVisible(false)}
        title="RefreshControl"
      >
        <ScrollView
          style={{ height: 290 }}
          contentContainerStyle={{ minHeight: 360, gap: 16, padding: 12 }}
          alwaysBounceVertical
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        >
          <AppText tone="muted">
            Deslizá hacia abajo desde el inicio de esta ventana.
          </AppText>
          <AppText accessibilityLiveRegion="polite">
            Actualizaciones: {refreshCount}
          </AppText>
          <View>
            <ActionButton
              label={refreshing ? 'Actualizando…' : 'Actualizar ahora'}
              onPress={refresh}
            />
          </View>
          <AppText variant="caption" tone="muted">
            La recarga está simulada; no necesita un servidor.
          </AppText>
        </ScrollView>
      </DemoDialog>
    </>
  );
}
