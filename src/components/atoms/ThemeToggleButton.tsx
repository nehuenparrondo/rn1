// src/components/atoms/ThemeToggleButton.tsx — Control global abajo a la derecha, fuera del área del teclado.
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FLOATING_EDGE } from '@/constants/app';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS } from '@/styles/spacing';
import { IconButton } from './IconButton';

export function ThemeToggleButton() {
  const { mode, isReady, toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  if (keyboardVisible) return null;
  return (
    <View
      style={[
        styles.position,
        theme.shadow,
        {
          right: Math.max(insets.right, FLOATING_EDGE),
          bottom: insets.bottom + FLOATING_EDGE,
        },
      ]}
    >
      <IconButton
        icon={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
        label={mode === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        disabled={!isReady}
        onPress={toggleTheme}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  position: { position: 'absolute', zIndex: 20, borderRadius: RADIUS.md },
});
