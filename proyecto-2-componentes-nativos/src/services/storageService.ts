// src/services/storageService.ts
// Encapsula el acceso a AsyncStorage para no utilizarlo directamente desde las vistas.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeMode } from '../types/theme';
import { THEME_STORAGE_KEY } from '../constants/app';

export async function saveThemePreference(themeMode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
}

export async function getThemePreference(): Promise<ThemeMode | null> {
  const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return null;
}
