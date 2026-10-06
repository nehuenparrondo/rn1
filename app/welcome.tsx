// app/welcome.tsx — Valida el estado público y lo entrega mediante props, nunca credenciales.
import { Redirect, useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app';
import { useAuth } from '@/hooks/useAuth';
import { WelcomePage } from '@/pages/WelcomePage';
import { parseUser } from '@/utils/responseGuards';

export default function WelcomeRoute() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const publicUser = parseUser(user);
  if (!publicUser) return <Redirect href={ROUTES.login} />;
  function handleLogout() {
    signOut();
    router.replace(ROUTES.login);
  }
  return <WelcomePage user={publicUser} onLogout={handleLogout} />;
}
