/**
 * frontend/src/context/AuthContext.tsx
 * signIn solicita el login y conserva únicamente el usuario público validado. signOut lo borra y cancela solicitudes pendientes.
 * El estado es temporal: no hay JWT, cookie de sesión ni autenticación persistente del servidor.
 */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { MESSAGES } from '@/constants/messages';
import { loginRequest } from '@/services/authService';
import type { AuthContextValue, LoginRequest, User } from '@/types/auth';
import { ApiError } from '@/utils/ApiError';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);
  const signOut = useCallback(() => {
    request.current?.abort();
    request.current = null;
    setIsAuthenticating(false);
    setUser(null);
  }, []);
  /** Consulta la API y solo conserva al usuario si la solicitud sigue vigente. */
  const signIn = useCallback(async (credentials: LoginRequest) => {
    if (request.current) throw new ApiError('busy', MESSAGES.busy);
    const controller = new AbortController();
    request.current = controller;
    setUser(null);
    setIsAuthenticating(true);
    try {
      const nextUser = await loginRequest(credentials, controller.signal);
      // Un logout durante el fetch no debe restaurar una identidad anterior.
      if (
        !mounted.current ||
        request.current !== controller ||
        controller.signal.aborted
      ) {
        throw new ApiError('cancelled', MESSAGES.cancelled);
      }
      // A partir de este estado la ruta de login puede mostrar la bienvenida.
      setUser(nextUser);
      return nextUser;
    } finally {
      if (mounted.current && request.current === controller) {
        request.current = null;
        setIsAuthenticating(false);
      }
    }
  }, []);
  const value = useMemo(
    () => ({ user, isAuthenticating, signIn, signOut }),
    [user, isAuthenticating, signIn, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
