/**
 * frontend/app/welcome.tsx
 * Comprueba el usuario del contexto y lo pasa a WelcomePage mediante user={publicUser}; al salir limpia el estado.
 */
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
  // Cumple el paso de datos por props: la página recibe el usuario público.
  return <WelcomePage user={publicUser} onLogout={handleLogout} />;
}
