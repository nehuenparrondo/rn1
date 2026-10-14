// Catálogo de componentes públicos documentados para React Native 0.86.
export const COMPONENT_GROUPS = [
  {
    title: 'Fundamentos',
    subtitle: 'La base de cualquier pantalla.',
    items: [
      {
        name: 'View',
        description: 'Agrupa elementos y organiza el espacio con Flexbox.',
        useCase: 'Contenedores, filas y tarjetas.',
        props: 'style · accessibilityLabel',
        code: '<View style={{ padding: 16 }} />',
      },
      {
        name: 'Text',
        description: 'Muestra texto con distintos tamaños, colores y formatos.',
        useCase: 'Títulos, párrafos y etiquetas.',
        props: 'style · numberOfLines',
        code: '<Text>Hola Mundo</Text>',
      },
      {
        name: 'Image',
        description: 'Muestra una imagen local o cargada desde una dirección.',
        useCase: 'Avatares, logos y fotografías.',
        props: 'source · resizeMode',
        code: '<Image source={localImage} />',
      },
      {
        name: 'ImageBackground',
        description:
          'Permite colocar otros elementos sobre una imagen de fondo.',
        useCase: 'Portadas y banners con texto.',
        props: 'source · imageStyle',
        code: '<ImageBackground source={localImage}>…</ImageBackground>',
      },
      {
        name: 'TextInput',
        description: 'Recibe texto del usuario mediante el teclado.',
        useCase: 'Formularios y búsquedas.',
        props: 'value · onChangeText · placeholder',
        code: '<TextInput value={text} onChangeText={setText} />',
      },
    ],
  },
  {
    title: 'Interacción',
    subtitle: 'Componentes que responden a tus acciones.',
    items: [
      {
        name: 'Button',
        description:
          'Ofrece un botón sencillo con apariencia propia de cada plataforma.',
        useCase: 'Acciones básicas, como aceptar o guardar.',
        props: 'title · onPress · disabled',
        code: '<Button title="Probar" onPress={handlePress} />',
      },
      {
        name: 'Pressable',
        description:
          'Detecta pulsaciones y permite personalizar sus estados visuales.',
        useCase: 'Botones personalizados y elementos interactivos.',
        props: 'onPress · onLongPress · style',
        code: '<Pressable onPress={handlePress}>…</Pressable>',
      },
      {
        name: 'Switch',
        description: 'Alterna un valor entre activado y desactivado.',
        useCase: 'Preferencias y opciones booleanas.',
        props: 'value · onValueChange · trackColor',
        code: '<Switch value={enabled} onValueChange={setEnabled} />',
      },
      {
        name: 'TouchableOpacity',
        description: 'Reduce la opacidad de su contenido al tocarlo.',
        useCase: 'Acciones con respuesta visual de transparencia.',
        props: 'onPress · activeOpacity',
        code: '<TouchableOpacity onPress={handlePress}>…</TouchableOpacity>',
      },
      {
        name: 'TouchableHighlight',
        description: 'Resalta el fondo de su único elemento hijo al pulsarlo.',
        useCase: 'Filas o botones con color de presión.',
        props: 'onPress · underlayColor',
        code: '<TouchableHighlight underlayColor="#7948CC">…</TouchableHighlight>',
      },
      {
        name: 'TouchableWithoutFeedback',
        description: 'Detecta un toque sin añadir una respuesta visual.',
        useCase: 'Cerrar el teclado al tocar fuera de un campo.',
        props: 'onPress · accessible',
        code: '<TouchableWithoutFeedback onPress={Keyboard.dismiss}>…</TouchableWithoutFeedback>',
      },
    ],
  },
  {
    title: 'Desplazamiento y listas',
    subtitle: 'Cómo mostrar contenido que no cabe de una vez.',
    items: [
      {
        name: 'ScrollView',
        description:
          'Desplaza un conjunto de elementos que se renderizan completos.',
        useCase: 'Pantallas pequeñas y contenido de tamaño limitado.',
        props: 'horizontal · contentContainerStyle',
        code: '<ScrollView horizontal>…</ScrollView>',
      },
      {
        name: 'FlatList',
        description:
          'Muestra datos como una lista que renderiza elementos de forma gradual.',
        useCase: 'Listados largos de productos o mensajes.',
        props: 'data · renderItem · keyExtractor',
        code: '<FlatList data={items} renderItem={renderItem} />',
      },
      {
        name: 'SectionList',
        description:
          'Organiza una lista virtualizada en secciones con encabezados.',
        useCase: 'Contactos agrupados o menús por categoría.',
        props: 'sections · renderItem · renderSectionHeader',
        code: '<SectionList sections={sections} renderItem={renderItem} />',
      },
      {
        name: 'VirtualizedList',
        description:
          'Es la base de las listas virtualizadas y permite definir cómo leer los datos.',
        useCase: 'Listas con estructuras de datos personalizadas.',
        props: 'getItem · getItemCount · renderItem',
        code: '<VirtualizedList getItem={getItem} getItemCount={getCount} />',
      },
      {
        name: 'RefreshControl',
        description: 'Añade el gesto de deslizar hacia abajo para actualizar.',
        useCase: 'Recargar el contenido de una pantalla.',
        props: 'refreshing · onRefresh',
        code: '<RefreshControl refreshing={loading} onRefresh={refresh} />',
      },
    ],
  },
  {
    title: 'Interfaz y sistema',
    subtitle: 'Carga, ventanas y comportamiento de la pantalla.',
    items: [
      {
        name: 'ActivityIndicator',
        description:
          'Muestra un indicador circular mientras se realiza una tarea.',
        useCase: 'Estados de carga sin progreso conocido.',
        props: 'animating · size · color',
        code: '<ActivityIndicator size="large" color="#FF4795" />',
      },
      {
        name: 'Modal',
        description: 'Presenta una ventana por encima del contenido actual.',
        useCase: 'Confirmaciones y contenido temporal.',
        props: 'visible · animationType · onRequestClose',
        code: '<Modal visible={visible} onRequestClose={close}>…</Modal>',
      },
      {
        name: 'KeyboardAvoidingView',
        description:
          'Ajusta la posición o el espacio disponible cuando aparece el teclado.',
        useCase: 'Mantener visibles los campos de un formulario.',
        props: 'behavior · keyboardVerticalOffset',
        code: '<KeyboardAvoidingView behavior="padding">…</KeyboardAvoidingView>',
      },
      {
        name: 'StatusBar',
        description:
          'Controla el aspecto y la visibilidad de la barra de estado del sistema.',
        useCase: 'Adaptar los indicadores de hora y batería al tema.',
        props: 'barStyle · hidden',
        code: '<StatusBar barStyle="light-content" />',
      },
    ],
  },
  {
    title: 'Específicos de plataforma',
    subtitle: 'También están incluidos, con sus límites bien indicados.',
    items: [
      {
        name: 'DrawerLayoutAndroid',
        description:
          'Abre un panel lateral nativo desde un borde de la pantalla.',
        useCase: 'Menús deslizables en Android.',
        props: 'drawerWidth · renderNavigationView',
        code: '<DrawerLayoutAndroid renderNavigationView={menu}>…</DrawerLayoutAndroid>',
        platform: 'Android',
      },
      {
        name: 'TouchableNativeFeedback',
        description:
          'Añade el efecto de onda nativo de Android al pulsar una vista.',
        useCase: 'Acciones con respuesta visual Android.',
        props: 'onPress · background',
        code: '<TouchableNativeFeedback onPress={handlePress}>…</TouchableNativeFeedback>',
        platform: 'Android',
      },
      {
        name: 'InputAccessoryView',
        description: 'Añade una barra personalizada encima del teclado de iOS.',
        useCase: 'Un botón Listo u otras acciones de edición.',
        props: 'nativeID · inputAccessoryViewID',
        code: '<InputAccessoryView nativeID="toolbar">…</InputAccessoryView>',
        platform: 'iOS',
      },
      {
        name: 'SafeAreaView',
        description:
          'El componente original evita zonas ocupadas por el sistema en iOS.',
        useCase: 'Respetar el notch y los bordes de pantalla.',
        props: 'style',
        code: '<SafeAreaView>…</SafeAreaView>',
        platform: 'iOS',
        legacy: 'Obsoleto: usar react-native-safe-area-context.',
      },
      {
        name: 'ProgressBarAndroid',
        description:
          'El componente legado muestra el progreso de una tarea en Android.',
        useCase: 'Una operación con porcentaje de avance conocido.',
        props: 'styleAttr · indeterminate · progress',
        code:
          '<ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={0.65} />',
        platform: 'Android',
        legacy:
          'Obsoleto: reemplazo en @react-native-community/progress-bar-android.',
      },
    ],
  },
] as const;

export type NativeComponentName =
  (typeof COMPONENT_GROUPS)[number]['items'][number]['name'];
export interface ComponentEntry {
  name: NativeComponentName;
  description: string;
  useCase: string;
  props: string;
  code: string;
  platform?: 'Android' | 'iOS';
  legacy?: string;
}
export const COMPONENT_COUNT = COMPONENT_GROUPS.reduce(
  (total, group) => total + group.items.length,
  0,
);
