// Los componentes exclusivos solo se montan en el sistema que los soporta.
import { useRef, useState } from 'react';
import {
  DrawerLayoutAndroid,
  Platform,
  ProgressBarAndroid,
  SafeAreaView,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import type { NativeComponentName } from '../../data/components';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../atoms/ActionButton';
import { AppText } from '../atoms/AppText';
import { DemoDialog } from '../molecules/DemoDialog';
import { KeyboardPreview } from './KeyboardPreview';

type PlatformName = Extract<
  NativeComponentName,
  | 'DrawerLayoutAndroid'
  | 'TouchableNativeFeedback'
  | 'InputAccessoryView'
  | 'SafeAreaView'
  | 'ProgressBarAndroid'
>;
export function PlatformPreview({ name }: { name: PlatformName }) {
  const { theme } = useTheme();
  const drawerRef = useRef<DrawerLayoutAndroid>(null);
  const [pressCount, setPressCount] = useState(0);
  const [visible, setVisible] = useState(false);
  if (name === 'InputAccessoryView') return <KeyboardPreview accessory />;
  if (name === 'SafeAreaView') {
    if (Platform.OS !== 'ios')
      return (
        <AppText variant="caption" tone="muted">
          Ejemplo del componente original disponible en iOS. La app usa la
          alternativa moderna.
        </AppText>
      );
    return (
      <>
        <ActionButton
          label="Ver área segura original"
          onPress={() => setVisible(true)}
        />
        <DemoDialog
          visible={visible}
          title="SafeAreaView (obsoleto)"
          onClose={() => setVisible(false)}
        >
          <SafeAreaView style={{ backgroundColor: theme.colors.primarySoft }}>
            <View style={{ padding: 18 }}>
              <AppText>Contenido dentro del área segura.</AppText>
            </View>
          </SafeAreaView>
          <AppText tone="muted" variant="caption">
            El efecto depende de la ubicación en pantalla. En este proyecto los
            márgenes del notch se resuelven con react-native-safe-area-context.
          </AppText>
        </DemoDialog>
      </>
    );
  }
  if (Platform.OS !== 'android')
    return (
      <AppText variant="caption" tone="muted">
        Este ejemplo requiere Android. En iOS y web se muestra su explicación,
        no una imitación.
      </AppText>
    );
  if (name === 'TouchableNativeFeedback')
    return (
      <View style={{ gap: 10 }}>
        <TouchableNativeFeedback
          accessibilityRole="button"
          onPress={() => setPressCount((currentCount) => currentCount + 1)}
          background={TouchableNativeFeedback.Ripple(
            theme.colors.accent,
            false,
          )}
        >
          <View
            style={[
              styles.touchable,
              { backgroundColor: theme.colors.primarySoft },
            ]}
          >
            <AppText tone="primary">Tocá para ver la onda</AppText>
          </View>
        </TouchableNativeFeedback>
        <AppText variant="caption" tone="muted">
          Pulsaciones: {pressCount}
        </AppText>
      </View>
    );
  if (name === 'ProgressBarAndroid')
    return (
      <View style={{ gap: 10 }}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={0.65}
          color={theme.colors.primary}
        />
        <AppText variant="caption" tone="muted">
          Progreso de ejemplo: 65 %. Componente legado.
        </AppText>
      </View>
    );
  return (
    <View style={{ height: 220 }}>
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerWidth={220}
        drawerPosition="left"
        drawerBackgroundColor={theme.colors.surfaceSecondary}
        renderNavigationView={() => (
          <View style={{ flex: 1, padding: 18, gap: 16 }}>
            <AppText variant="subtitle">Panel lateral</AppText>
            <AppText tone="muted">Este es un drawer nativo.</AppText>
            <ActionButton
              label="Cerrar panel"
              onPress={() => drawerRef.current?.closeDrawer()}
            />
          </View>
        )}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 12 }}
        >
          <AppText variant="caption" tone="muted">
            Deslizá desde la izquierda o tocá el botón.
          </AppText>
          <ActionButton
            label="Abrir panel"
            onPress={() => drawerRef.current?.openDrawer()}
          />
        </View>
      </DrawerLayoutAndroid>
    </View>
  );
}
const styles = StyleSheet.create({
  touchable: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
