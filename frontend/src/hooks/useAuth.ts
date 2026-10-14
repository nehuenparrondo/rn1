/**
 * frontend/src/hooks/useAuth.ts
 * Devuelve usuario, estado de envío, signIn y signOut. Requiere estar dentro de AuthProvider.
 */
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
