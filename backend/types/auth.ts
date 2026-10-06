// backend/types/auth.ts — Separa las credenciales de los datos públicos de respuesta.
export interface LoginRequest {
  email: string;
  password: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationErrors;
}

export type LoginResponse =
  { success: true; message: string; user: PublicUser } | ErrorResponse;

export interface AuthLocals {
  loginRequest?: LoginRequest;
}
