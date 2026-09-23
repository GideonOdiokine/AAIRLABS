import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ResolvedScheme = 'light' | 'dark';

const STORAGE_KEY = '@aairlabs/theme-preference';

type ThemePreferenceValue = {
  preference: ThemePreference;
  colorScheme: ResolvedScheme;
  setPreference: (preference: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceValue | null>(null);

const ORDER: ThemePreference[] = ['light', 'dark', 'system'];

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // Hydrate the stored choice once on start; stays on "system" until then.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && isThemePreference(stored)) setPreferenceState(stored);
      } catch {
        // Unreadable preference: keep the "system" default.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    // Fire and forget: a failed write just means it resets next launch.
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const cyclePreference = useCallback(() => {
    setPreferenceState((prev) => {
      const next = ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length];
      void AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const colorScheme: ResolvedScheme = preference === 'system' ? system : preference;

  const value = useMemo(
    () => ({ preference, colorScheme, setPreference, cyclePreference }),
    [preference, colorScheme, setPreference, cyclePreference]
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return ctx;
}

// Falls back to the OS scheme outside the provider, so color hooks never
// crash during an early render.
export function useResolvedColorScheme(): ResolvedScheme {
  const ctx = useContext(ThemePreferenceContext);
  const system = useSystemColorScheme() ?? 'light';
  return ctx ? ctx.colorScheme : system;
}
