/**
 * frontend/app/index.tsx
 * Muestra LoginPage si no hay usuario público válido; si lo hay, redirige a la bienvenida.
 */
import { Redirect, useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { parseUser } from '@/utils/responseGuards';

export default function LoginRoute() {
  const router = useRouter();
  const { user } = useAuth();
  if (parseUser(user)) return <Redirect href={ROUTES.welcome} />;
  return <LoginPage onRegister={() => router.push(ROUTES.register)} />;
}
