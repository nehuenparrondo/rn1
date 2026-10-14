/**
 * frontend/src/types/auth.ts
 * Define contratos de credenciales, respuestas JSON, errores y datos públicos. Los tipos del cliente y del servidor son independientes.
 */
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
export interface RegistrationRequest extends LoginRequest {
  name: string;
}
export interface RegistrationValues extends RegistrationRequest {
  confirmPassword: string;
}
export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
export type LoginResponse =
  | { success: true; message: string; user: User }
  | { success: false; message: string; errors?: ValidationErrors };
export type RegistrationResponse =
  | { success: true; message: string }
  | { success: false; message: string; errors?: ValidationErrors };
export interface LoginPageProps {
  onRegister: () => void;
}
export interface RegisterPageProps {
  onLogin: () => void;
}
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
