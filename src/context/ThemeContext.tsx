// src/context/ThemeContext.tsx — Sigue el sistema hasta elegir un modo y guarda solo esa elección.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';

import { THEME_STORAGE_KEY } from '@/constants/app';
import { MESSAGES } from '@/constants/messages';
import { THEMES } from '@/styles/theme';
import type { ThemeContextValue, ThemeMode } from '@/types/theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemMode = useColorScheme();
  const [preference, setPreference] = useState<ThemeMode | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const writes = useRef<Promise<void>>(Promise.resolve());
  const mounted = useRef(false);
  const mode = preference ?? (systemMode === 'dark' ? 'dark' : 'light');
  useEffect(() => {
    mounted.current = true;
    let active = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (active && (stored === 'light' || stored === 'dark')) setPreference(stored);
      })
      .catch(() => {
        if (active) setStorageError(MESSAGES.themeRead);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);
  const toggleTheme = useCallback(() => {
    if (!isReady) return;
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setPreference(nextMode);
    // Serializar evita que una escritura lenta revierta la última elección.
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode))
      .then(() => {
        if (mounted.current) setStorageError(null);
      })
      .catch(() => {
        if (mounted.current) setStorageError(MESSAGES.themeStorage);
      });
  }, [isReady, mode]);
  const value = useMemo(
    () => ({
      theme: THEMES[mode],
      mode,
      isReady,
      storageError,
      toggleTheme,
    }),
    [mode, isReady, storageError, toggleTheme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
