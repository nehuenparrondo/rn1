// src/pages/LoginPage.tsx — Página de ingreso con layout dividido o apilado y formulario real.
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/atoms/Card';
import { EntranceView } from '@/components/atoms/EntranceView';
import { BrandHeader } from '@/components/molecules/BrandHeader';
import { InfoRow } from '@/components/molecules/InfoRow';
import { LoginForm } from '@/components/organisms/LoginForm';
import { ScreenShell } from '@/components/organisms/ScreenShell';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { FORM_MAX_WIDTH } from '@/styles/breakpoints';
import { SPACING } from '@/styles/spacing';

export function LoginPage() {
  const { isDesktop, isMobile } = useBreakpoint();
  return (
    <ScreenShell>
      <BrandHeader />
      <EntranceView style={[styles.body, isDesktop && styles.bodyWide]}>
        <View style={[styles.intro, isDesktop && styles.introWide]}>
          <AppText variant="eyebrow" tone="primary">
            UN ESPACIO PARA VOS
          </AppText>
          <AppText variant="title" style={isDesktop ? styles.heroTitle : undefined}>
            Tu próximo paso empieza acá.
          </AppText>
          <AppText tone="textSecondary">
            Ingresá con tu cuenta para acceder a una bienvenida con tus datos.
          </AppText>
          {!isMobile && (
            <View style={styles.features}>
              <InfoRow
                icon="shield-checkmark-outline"
                title="Ingreso verificado"
                description="Tus credenciales se validan contra la base de datos."
              />
              <InfoRow
                icon="color-palette-outline"
                title="A tu manera"
                description="Modo claro u oscuro, en cualquier pantalla."
              />
            </View>
          )}
        </View>
        <View style={styles.cardWidth}>
          <Card>
            <AppText variant="heading" accessibilityRole="header">
              Ingresá a tu cuenta
            </AppText>
            <AppText tone="textSecondary">Nos alegra verte de nuevo.</AppText>
            <LoginForm />
          </Card>
        </View>
      </EntranceView>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xxl,
    paddingVertical: SPACING.xl,
  },
  bodyWide: { flexDirection: 'row', gap: SPACING.hero },
  intro: { width: '100%', maxWidth: FORM_MAX_WIDTH, gap: SPACING.lg },
  introWide: { flex: 1, minWidth: 0 },
  heroTitle: { fontSize: 48, lineHeight: 56 },
  features: { gap: SPACING.xl, paddingTop: SPACING.xl },
  cardWidth: { width: '100%', maxWidth: FORM_MAX_WIDTH },
});
