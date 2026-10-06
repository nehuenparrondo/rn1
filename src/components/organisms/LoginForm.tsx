// src/components/organisms/LoginForm.tsx — Formulario real; el cambio de ruta depende del usuario validado en contexto.
import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { TextField } from '@/components/molecules/TextField';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';
import { validateLogin } from '@/utils/validation';

export function LoginForm() {
  const {
    email,
    password,
    errors,
    touched,
    message,
    isSubmitting,
    changeEmail,
    changePassword,
    blurField,
    submit,
  } = useLoginForm();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  function handleSubmit() {
    if (isSubmitting) return;
    const validation = validateLogin({ email, password });
    if (validation.email) emailRef.current?.focus();
    else if (validation.password) passwordRef.current?.focus();
    void submit();
  }
  return (
    <View style={styles.form}>
      <TextField
        label="Email"
        ref={emailRef}
        value={email}
        onChangeText={changeEmail}
        error={errors.email}
        valid={touched.email && !errors.email}
        editable={!isSubmitting}
        placeholder="tu@email.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        onBlur={() => blurField('email')}
      />
      <TextField
        label="Contraseña"
        ref={passwordRef}
        value={password}
        onChangeText={changePassword}
        error={errors.password}
        valid={touched.password && !errors.password}
        editable={!isSubmitting}
        placeholder="Ingresá tu contraseña"
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        returnKeyType="done"
        submitBehavior="submit"
        onSubmitEditing={handleSubmit}
        onBlur={() => blurField('password')}
      />
      {message && (
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[
            styles.error,
            {
              backgroundColor: theme.colors.primarySoft,
              borderColor: theme.colors.error,
            },
          ]}
        >
          <AppText variant="caption" tone="error">
            {message}
          </AppText>
        </View>
      )}
      <Button label="Ingresar" loading={isSubmitting} onPress={handleSubmit} />
      <AppText variant="caption" tone="textSecondary">
        Usá el email y la contraseña de una cuenta registrada. La API verificará el
        ingreso.
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  form: { gap: SPACING.xl, width: '100%' },
  error: { borderWidth: 1, borderRadius: RADIUS.sm, padding: SPACING.md },
});
