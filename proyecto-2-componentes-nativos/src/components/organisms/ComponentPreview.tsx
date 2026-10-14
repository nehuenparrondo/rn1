// Selecciona ejemplos reales de los componentes sin mezclar APIs con componentes.
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeComponentName } from '../../data/components';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../atoms/ActionButton';
import { AppText } from '../atoms/AppText';
import { DemoDialog } from '../molecules/DemoDialog';
import { InteractionPreview } from './InteractionPreview';
import { KeyboardPreview } from './KeyboardPreview';
import { ListPreview } from './ListPreview';
import { PlatformPreview } from './PlatformPreview';
import { RefreshPreview } from './RefreshPreview';

const LOCAL_IMAGE = require('../../../assets/component-pattern.png');
export function ComponentPreview({ name }: { name: NativeComponentName }) {
  const { theme, themeMode } = useTheme();
  const [inputText, setInputText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alternateStatus, setAlternateStatus] = useState(false);
  switch (name) {
    case 'View':
      return (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {['primary', 'accent', 'surfaceSecondary'].map((colorName) => (
            <View
              key={colorName}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 10,
                backgroundColor:
                  theme.colors[
                    colorName as 'primary' | 'accent' | 'surfaceSecondary'
                  ],
              }}
            />
          ))}
        </View>
      );
    case 'Text':
      return (
        <Text
          style={{ color: theme.colors.text, fontSize: 21, fontWeight: '700' }}
        >
          Un texto con{' '}
          <Text style={{ color: theme.colors.primary }}>color.</Text>
        </Text>
      );
    case 'Image':
      return (
        <Image
          source={LOCAL_IMAGE}
          accessibilityLabel="Composición geométrica violeta y rosa"
          resizeMode="cover"
          style={styles.image}
        />
      );
    case 'ImageBackground':
      return (
        <ImageBackground
          source={LOCAL_IMAGE}
          imageStyle={{ borderRadius: 12 }}
          style={[styles.image, { justifyContent: 'center', padding: 20 }]}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '900',
              fontSize: 22,
              textShadowColor: '#000000',
              textShadowRadius: 8,
            }}
          >
            Texto sobre una imagen.
          </Text>
        </ImageBackground>
      );
    case 'TextInput':
      return (
        <View style={{ gap: 10 }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            accessibilityLabel="Texto de ejemplo"
            placeholder="Escribí tu nombre…"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text },
            ]}
          />
          <AppText variant="caption" tone="muted">
            Tu texto: {inputText || 'todavía no escribiste'}
          </AppText>
        </View>
      );
    case 'Button':
    case 'Pressable':
    case 'Switch':
    case 'TouchableOpacity':
    case 'TouchableHighlight':
    case 'TouchableWithoutFeedback':
      return <InteractionPreview name={name} />;
    case 'ScrollView':
    case 'FlatList':
    case 'SectionList':
    case 'VirtualizedList':
      return <ListPreview name={name} />;
    case 'RefreshControl':
      return <RefreshPreview />;
    case 'KeyboardAvoidingView':
      return <KeyboardPreview />;
    case 'DrawerLayoutAndroid':
    case 'TouchableNativeFeedback':
    case 'InputAccessoryView':
    case 'SafeAreaView':
    case 'ProgressBarAndroid':
      return <PlatformPreview name={name} />;
    case 'ActivityIndicator':
      return (
        <View style={{ gap: 12 }}>
          <View style={{ height: 40, justifyContent: 'center' }}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={theme.colors.primary}
                accessibilityLabel="Cargando ejemplo"
              />
            ) : (
              <AppText tone="accent">Carga detenida</AppText>
            )}
          </View>
          <ActionButton
            label={loading ? 'Detener carga' : 'Iniciar carga'}
            onPress={() => setLoading((currentValue) => !currentValue)}
          />
        </View>
      );
    case 'Modal':
      return (
        <>
          <ActionButton
            label="Abrir ventana"
            onPress={() => setModalVisible(true)}
          />
          <DemoDialog
            visible={modalVisible}
            title="Ejemplo de Modal"
            onClose={() => setModalVisible(false)}
          >
            <AppText tone="muted">
              Esta ventana se presenta por encima del catálogo.
            </AppText>
            <ActionButton
              label="Entendido"
              onPress={() => setModalVisible(false)}
            />
          </DemoDialog>
        </>
      );
    case 'StatusBar':
      return (
        <View style={{ gap: 12 }}>
          {Platform.OS !== 'web' && (
            <StatusBar
              barStyle={
                (themeMode === 'dark') !== alternateStatus
                  ? 'light-content'
                  : 'dark-content'
              }
            />
          )}
          <AppText variant="caption" tone="muted">
            {Platform.OS === 'web'
              ? 'La barra de estado pertenece al sistema del celular, no al navegador.'
              : 'Mirá la hora y la batería al cambiar el estilo.'}
          </AppText>
          {Platform.OS !== 'web' && (
            <ActionButton
              label="Cambiar barra de estado"
              onPress={() =>
                setAlternateStatus((currentValue) => !currentValue)
              }
            />
          )}
        </View>
      );
  }
}
const styles = StyleSheet.create({
  image: { width: '100%', height: 130, borderRadius: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
    fontSize: 16,
  },
});
