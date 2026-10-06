// Controla validación, confirmación y cancelación; nunca conserva la contraseña creada.
import { useCallback, useEffect, useRef, useState } from 'react';
import { MESSAGES } from '@/constants/messages';
import { registrationRequest } from '@/services/authService';
import type { RegistrationValues, ValidationErrors } from '@/types/auth';
import { ApiError } from '@/utils/ApiError';
import { validateRegistration } from '@/utils/validation';

const EMPTY_VALUES: RegistrationValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const UNTOUCHED = { name: false, email: false, password: false, confirmPassword: false };

export function useRegistrationForm() {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState(UNTOUCHED);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current?.abort();
    };
  }, []);
  const changeField = useCallback((field: keyof RegistrationValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setMessage(null);
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === 'password' ? { confirmPassword: undefined } : {}),
    }));
    setTouched((previous) => ({
      ...previous,
      [field]: false,
      ...(field === 'password' ? { confirmPassword: false } : {}),
    }));
  }, []);
  const blurField = useCallback(
    (field: keyof RegistrationValues) => {
      const validation = validateRegistration(values);
      setTouched((previous) => ({ ...previous, [field]: true }));
      setErrors((previous) => ({ ...previous, [field]: validation[field] }));
    },
    [values],
  );
  const submit = useCallback(async () => {
    if (request.current || isCreated) return;
    const validation = validateRegistration(values);
    setErrors(validation);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    setMessage(null);
    if (Object.keys(validation).length > 0) return;
    const controller = new AbortController();
    request.current = controller;
    setIsSubmitting(true);
    try {
      await registrationRequest(values, controller.signal);
      if (!mounted.current || controller.signal.aborted) return;
      setValues(EMPTY_VALUES);
      setIsCreated(true);
    } catch (error) {
      if (mounted.current) {
        if (error instanceof ApiError) {
          setErrors(error.errors ?? {});
          if (error.kind !== 'cancelled') setMessage(error.message);
        } else setMessage(MESSAGES.server);
      }
    } finally {
      if (mounted.current && request.current === controller) {
        request.current = null;
        setIsSubmitting(false);
      }
    }
  }, [values, isCreated]);
  return {
    values,
    errors,
    touched,
    message,
    isSubmitting,
    isCreated,
    changeField,
    blurField,
    submit,
  };
}
