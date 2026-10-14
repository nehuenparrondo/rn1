// Ejemplo real del teclado y su barra de herramientas exclusiva de iOS.
import { useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../atoms/ActionButton';
import { AppText } from '../atoms/AppText';
import { DemoDialog } from '../molecules/DemoDialog';

export function KeyboardPreview({
  accessory = false,
}: {
  accessory?: boolean;
}) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const toolbarID = 'native-components-toolbar';
  if (accessory && Platform.OS !== 'ios')
    return (
      <AppText variant="caption" tone="muted">
        La barra sobre el teclado se prueba en un iPhone o iPad.
      </AppText>
    );
  function closeExample() {
    Keyboard.dismiss();
    setVisible(false);
  }
  return (
    <>
      <ActionButton
        label={accessory ? 'Probar barra del teclado' : 'Probar con el teclado'}
        onPress={() => setVisible(true)}
      />
      <DemoDialog
        visible={visible}
        onClose={closeExample}
        title={accessory ? 'InputAccessoryView' : 'KeyboardAvoidingView'}
        fullScreen
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'space-between', gap: 20 }}>
            <AppText tone="muted">
              {accessory
                ? 'Tocá el campo: aparece el botón Listo sobre el teclado.'
                : 'Tocá el campo de abajo. El contenedor ajusta su espacio al abrirse el teclado.'}
            </AppText>
            <View style={{ gap: 12 }}>
              <TextInput
                autoFocus
                accessibilityLabel="Campo de ejemplo con teclado"
                value={text}
                onChangeText={setText}
                placeholder="Escribí un mensaje…"
                placeholderTextColor={theme.colors.textSecondary}
                inputAccessoryViewID={accessory ? toolbarID : undefined}
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
              />
              {!accessory && (
                <ActionButton
                  label="Ocultar teclado"
                  onPress={Keyboard.dismiss}
                />
              )}
            </View>
          </View>
          {accessory && Platform.OS === 'ios' && (
            <InputAccessoryView
              nativeID={toolbarID}
              backgroundColor={theme.colors.surface}
            >
              <View style={{ padding: 10, alignItems: 'flex-end' }}>
                <ActionButton label="Listo" onPress={Keyboard.dismiss} />
              </View>
            </InputAccessoryView>
          )}
        </KeyboardAvoidingView>
      </DemoDialog>
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 50,
    fontSize: 16,
  },
});
