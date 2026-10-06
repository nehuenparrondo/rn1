// src/pages/WelcomePage.tsx — Recibe el usuario público por props y ofrece salida y preferencias reales.
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { EntranceView } from '@/components/atoms/EntranceView';
import { BrandHeader } from '@/components/molecules/BrandHeader';
import { InfoRow } from '@/components/molecules/InfoRow';
import { UserDetailRow } from '@/components/molecules/UserDetailRow';
import { ScreenShell } from '@/components/organisms/ScreenShell';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS, SPACING } from '@/styles/spacing';
import type { WelcomePageProps } from '@/types/auth';
import { formatLoginDate, getRoleLabel } from '@/utils/userPresentation';

export function WelcomePage({ user, onLogout }: WelcomePageProps) {
  const { isMobile } = useBreakpoint();
  const { theme, toggleTheme, mode } = useTheme();
  return (
    <ScreenShell>
      <BrandHeader />
      <EntranceView style={styles.sections}>
        <View style={styles.hero}>
          <View style={[styles.badge, { backgroundColor: theme.colors.primarySoft }]}>
            <AppText variant="caption" tone="primary" style={styles.badgeText}>
              INGRESO CORRECTO
            </AppText>
          </View>
          <AppText variant="title" accessibilityRole="header">
            Hola, {user.name}.
          </AppText>
          <AppText tone="textSecondary">
            Bienvenido a tu espacio. Estos son los datos de tu cuenta.
          </AppText>
        </View>
        <View style={[styles.grid, !isMobile && styles.gridWide]}>
          <View style={styles.column}>
            <Card>
              <AppText variant="heading" accessibilityRole="header">
                Tu cuenta
              </AppText>
              <AppText variant="caption" tone="textSecondary">
                Datos devueltos por la API, sin contraseña ni hash.
              </AppText>
              <UserDetailRow label="Nombre" value={user.name} />
              <UserDetailRow label="Email" value={user.email} />
              <UserDetailRow label="Rol" value={getRoleLabel(user.role)} />
              <UserDetailRow label="Identificador" value={String(user.id)} />
            </Card>
          </View>
          <View style={styles.column}>
            <Card>
              <AppText variant="heading" accessibilityRole="header">
                Este ingreso
              </AppText>
              <UserDetailRow
                label="Último acceso registrado"
                value={formatLoginDate(user.lastLoginAt)}
              />
              <InfoRow
                icon="checkmark-circle-outline"
                title="Credenciales verificadas"
                description="El servidor comparó la contraseña y registró el resultado."
              />
              <InfoRow
                icon="time-outline"
                title="Fecha del evento"
                description="Se obtiene de los accesos exitosos y se muestra en tu zona horaria."
              />
              <InfoRow
                icon="phone-portrait-outline"
                title="Estado en memoria"
                description="Al recargar o cerrar la app, tendrás que volver a ingresar."
              />
            </Card>
          </View>
        </View>
        <Card>
          <AppText variant="heading" accessibilityRole="header">
            Sobre tus datos
          </AppText>
          <InfoRow
            icon="lock-closed-outline"
            title="La contraseña no viaja a esta pantalla"
            description="Solo se envió en el cuerpo del login. No se guarda en el dispositivo."
          />
          <InfoRow
            icon="color-palette-outline"
            title="Una preferencia que sí se guarda"
            description="El modo claro u oscuro se conserva para tu próxima visita."
          />
          <AppText variant="caption" tone="textSecondary">
            Esta bienvenida muestra un ingreso validado. No habilita por sí sola permisos
            de servidor ni una sesión permanente.
          </AppText>
        </Card>
        <Card>
          <AppText variant="heading" accessibilityRole="header">
            Accesos rápidos
          </AppText>
          <AppText tone="textSecondary">
            Cambiá la apariencia o salí para volver al formulario.
          </AppText>
          <View style={[styles.actions, !isMobile && styles.actionsWide]}>
            <View style={styles.column}>
              <Button
                label={mode === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'}
                variant="secondary"
                onPress={toggleTheme}
              />
            </View>
            <View style={styles.column}>
              <Button label="Cerrar sesión" onPress={onLogout} />
            </View>
          </View>
        </Card>
        <AppText variant="caption" tone="textSecondary">
          NP · Acceso de usuarios
        </AppText>
      </EntranceView>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({
  sections: { gap: SPACING.xl },
  hero: { gap: SPACING.lg, paddingVertical: SPACING.xl },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  badgeText: { fontWeight: '800', letterSpacing: 1 },
  grid: { gap: SPACING.xl },
  gridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { flex: 1, minWidth: 0, width: '100%' },
  actions: { gap: SPACING.md },
  actionsWide: { flexDirection: 'row' },
});
