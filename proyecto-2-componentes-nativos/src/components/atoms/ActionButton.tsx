// Botón reutilizable para las acciones de las demostraciones.
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { AppText } from './AppText';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
}
export function ActionButton({ label, onPress }: ActionButtonProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.colors.primary, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <AppText
        style={{
          color: theme.colors.onPrimary,
          fontWeight: '700',
          textAlign: 'center',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
