// La ruta mantiene la navegación fuera del formulario y redirige usuarios ya ingresados.
import { Redirect, useRouter } from 'expo-router';
import { ROUTES } from '@/constants/app';
import { useAuth } from '@/hooks/useAuth';
import { RegisterPage } from '@/pages/RegisterPage';
import { parseUser } from '@/utils/responseGuards';

export default function RegisterRoute() {
  const router = useRouter();
  const { user } = useAuth();
  if (parseUser(user)) return <Redirect href={ROUTES.welcome} />;
  return <RegisterPage onLogin={() => router.replace(ROUTES.login)} />;
}
