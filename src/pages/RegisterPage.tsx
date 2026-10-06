// Conserva el diseño violeta y rosa del login, adaptable a móvil y escritorio.
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { Card } from '@/components/atoms/Card';
import { EntranceView } from '@/components/atoms/EntranceView';
import { BrandHeader } from '@/components/molecules/BrandHeader';
import { InfoRow } from '@/components/molecules/InfoRow';
import { RegistrationForm } from '@/components/organisms/RegistrationForm';
import { ScreenShell } from '@/components/organisms/ScreenShell';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { FORM_MAX_WIDTH } from '@/styles/breakpoints';
import { SPACING } from '@/styles/spacing';
import type { RegisterPageProps } from '@/types/auth';

export function RegisterPage({ onLogin }: RegisterPageProps) {
  const { isDesktop, isMobile } = useBreakpoint();
  return (
    <ScreenShell>
      <BrandHeader />
      <EntranceView style={[styles.body, isDesktop && styles.bodyWide]}>
        <View style={[styles.intro, isDesktop && styles.introWide]}>
          <AppText variant="eyebrow" tone="primary">
            TU PRIMER PASO
          </AppText>
          <AppText variant="title" style={isDesktop ? styles.heroTitle : undefined}>
            Un lugar para empezar.
          </AppText>
          <AppText tone="textSecondary">
            Creá tu cuenta y después ingresá con tu email y contraseña.
          </AppText>
          {!isMobile && (
            <InfoRow
              icon="lock-closed-outline"
              title="Tu contraseña, protegida"
              description="Guardamos un hash seguro, nunca tu contraseña en texto plano."
            />
          )}
        </View>
        <View style={styles.cardWidth}>
          <Card>
            <AppText variant="heading" accessibilityRole="header">
              Creá tu cuenta
            </AppText>
            <AppText tone="textSecondary">Completá tus datos para empezar.</AppText>
            <RegistrationForm onLogin={onLogin} />
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
  cardWidth: { width: '100%', maxWidth: FORM_MAX_WIDTH },
});
