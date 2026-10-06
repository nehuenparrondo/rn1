// src/components/molecules/TextField.tsx — Agrupa etiqueta, input, mensajes y visibilidad de contraseña.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SPACING } from '@/styles/spacing';
import { AppText } from '@/components/atoms/AppText';
import { IconButton } from '@/components/atoms/IconButton';
import { Input, type InputProps } from '@/components/atoms/Input';

interface TextFieldProps extends Omit<
  InputProps,
  'invalid' | 'secureTextEntry' | 'valid'
> {
  label: string;
  error?: string;
  hint?: string;
  valid?: boolean;
  isPassword?: boolean;
}
export function TextField({
  label,
  error,
  hint,
  valid = false,
  isPassword = false,
  editable = true,
  accessibilityLabel,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.field}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.row}>
        <Input
          {...props}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={error ?? hint}
          editable={editable}
          secureTextEntry={isPassword && !showPassword}
          invalid={Boolean(error)}
          valid={valid && !error}
        />
        {isPassword && (
          <IconButton
            size={44}
            variant="quiet"
            icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            selected={showPassword}
            disabled={!editable}
            onPress={() => setShowPassword((previous) => !previous)}
          />
        )}
      </View>
      {error ? (
        <AppText variant="caption" tone="error" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" tone="textSecondary">
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  field: { width: '100%', gap: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  label: { fontWeight: '700' },
});
