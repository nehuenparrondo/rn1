// src/types/auth.ts — Credenciales privadas y datos públicos con contratos separados.
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface ValidationErrors {
  email?: string;
  password?: string;
}
export type LoginResponse =
  | { success: true; message: string; user: User }
  | { success: false; message: string; errors?: ValidationErrors };
export interface WelcomePageProps {
  user: User;
  onLogout: () => void;
}
export interface AuthContextValue {
  user: User | null;
  isAuthenticating: boolean;
  signIn: (credentials: LoginRequest) => Promise<User>;
  signOut: () => void;
}
