// src/hooks/useLoginForm.ts — Valida campos y controla el envío sin incorporar navegación.
import { useCallback, useEffect, useRef, useState } from 'react';

import { MESSAGES } from '@/constants/messages';
import type { User, ValidationErrors } from '@/types/auth';
import { ApiError } from '@/utils/ApiError';
import { normalizeEmail, validateLogin } from '@/utils/validation';
import { useAuth } from './useAuth';

export function useLoginForm() {
  const { signIn, isAuthenticating } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [message, setMessage] = useState<string | null>(null);
  const submitting = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const changeEmail = useCallback((value: string) => {
    setEmail(value);
    setMessage(null);
    setErrors((previous) => ({ ...previous, email: undefined }));
    setTouched((previous) => ({ ...previous, email: false }));
  }, []);
  const changePassword = useCallback((value: string) => {
    setPassword(value);
    setMessage(null);
    setErrors((previous) => ({ ...previous, password: undefined }));
    setTouched((previous) => ({ ...previous, password: false }));
  }, []);
  const blurField = useCallback(
    (field: keyof ValidationErrors) => {
      const validation = validateLogin({ email, password });
      setTouched((previous) => ({ ...previous, [field]: true }));
      setErrors((previous) => ({ ...previous, [field]: validation[field] }));
    },
    [email, password],
  );
  const submit = useCallback(async (): Promise<User | null> => {
    if (submitting.current || isAuthenticating) return null;
    const validation = validateLogin({ email, password });
    setErrors(validation);
    setTouched({ email: true, password: true });
    setMessage(null);
    if (Object.keys(validation).length > 0) return null;
    submitting.current = true;
    try {
      const user = await signIn({ email: normalizeEmail(email), password });
      if (!mounted.current) return null;
      setPassword('');
      return user;
    } catch (error) {
      if (mounted.current) {
        if (error instanceof ApiError) {
          setErrors(error.errors ?? {});
          if (error.kind !== 'cancelled') setMessage(error.message);
        } else setMessage(MESSAGES.server);
      }
      return null;
    } finally {
      submitting.current = false;
    }
  }, [email, password, signIn, isAuthenticating]);
  return {
    email,
    password,
    errors,
    touched,
    message,
    isSubmitting: isAuthenticating,
    changeEmail,
    changePassword,
    blurField,
    submit,
  };
}
