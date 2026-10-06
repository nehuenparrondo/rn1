// app/index.tsx — Muestra el formulario o redirige cuando la API ya validó al usuario.
import { Redirect } from 'expo-router';
import { ROUTES } from '@/constants/app';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';
import { parseUser } from '@/utils/responseGuards';

export default function LoginRoute() {
  const { user } = useAuth();
  if (parseUser(user)) return <Redirect href={ROUTES.welcome} />;
  return <LoginPage />;
}
