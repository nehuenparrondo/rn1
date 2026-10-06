// Crea la cuenta con cuatro campos y devuelve al ingreso solo después de confirmar la API.
import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { FormNotice } from '@/components/molecules/FormNotice';
import { TextField } from '@/components/molecules/TextField';
import { MESSAGES } from '@/constants/messages';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { SPACING } from '@/styles/spacing';
import type { RegisterPageProps } from '@/types/auth';
import { validateRegistration } from '@/utils/validation';

export function RegistrationForm({ onLogin }: RegisterPageProps) {
  const {
    values,
    errors,
    touched,
    message,
    isSubmitting,
    isCreated,
    changeField,
    blurField,
    submit,
  } = useRegistrationForm();
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmationRef = useRef<TextInput>(null);
  function handleSubmit() {
    if (isSubmitting) return;
    const validation = validateRegistration(values);
    if (validation.name) nameRef.current?.focus();
    else if (validation.email) emailRef.current?.focus();
    else if (validation.password) passwordRef.current?.focus();
    else if (validation.confirmPassword) confirmationRef.current?.focus();
    void submit();
  }
  if (isCreated)
    return (
      <View style={styles.form}>
        <FormNotice message={MESSAGES.accountCreated} tone="success" />
        <Button label="Ir al login" onPress={onLogin} />
      </View>
    );
  return (
    <View style={styles.form}>
      <TextField
        label="Nombre"
        ref={nameRef}
        value={values.name}
        onChangeText={(value) => changeField('name', value)}
        error={errors.name}
        valid={touched.name && !errors.name}
        editable={!isSubmitting}
        placeholder="Tu nombre"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
        onBlur={() => blurField('name')}
      />
      <TextField
        label="Email"
        ref={emailRef}
        value={values.email}
        onChangeText={(value) => changeField('email', value)}
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
        value={values.password}
        onChangeText={(value) => changeField('password', value)}
        error={errors.password}
        valid={touched.password && !errors.password}
        editable={!isSubmitting}
        placeholder="Creá tu contraseña"
        hint="Al menos 8 caracteres."
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmationRef.current?.focus()}
        onBlur={() => blurField('password')}
      />
      <TextField
        label="Confirmar contraseña"
        ref={confirmationRef}
        value={values.confirmPassword}
        onChangeText={(value) => changeField('confirmPassword', value)}
        error={errors.confirmPassword}
        valid={touched.confirmPassword && !errors.confirmPassword}
        editable={!isSubmitting}
        placeholder="Repetí tu contraseña"
        isPassword
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        returnKeyType="done"
        submitBehavior="submit"
        onSubmitEditing={handleSubmit}
        onBlur={() => blurField('confirmPassword')}
      />
      {message && <FormNotice message={message} />}
      <Button
        label="Crear cuenta"
        loadingLabel="Creando cuenta…"
        loading={isSubmitting}
        onPress={handleSubmit}
      />
      <AppText variant="caption" tone="textSecondary">
        ¿Ya tenés una cuenta?
      </AppText>
      <Button
        label="Volver al login"
        variant="secondary"
        disabled={isSubmitting}
        onPress={onLogin}
      />
    </View>
  );
}
const styles = StyleSheet.create({ form: { gap: SPACING.xl, width: '100%' } });
