/**
 * use-theme-preference — the light / dark / system theme choice (Phase 4 bonus).
 *
 * Holds a persisted preference and resolves it to a concrete `light | dark`
 * scheme, falling back to the OS scheme when the user leaves it on "system".
 * `useThemeColor` and the root layout resolve their scheme through this, so a
 * single toggle re-themes the whole app without any component restyle.
 *
 * Persistence lives here (its own AsyncStorage key) rather than in the task
 * storage module, which stays dedicated to the task list.
 */
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

/** The three user-selectable modes; "system" follows the OS setting. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** A concrete, resolved scheme — what components actually render against. */
export type ResolvedScheme = 'light' | 'dark';

const STORAGE_KEY = '@aairlabs/theme-preference';

type ThemePreferenceValue = {
  /** The raw stored choice, including "system". */
  preference: ThemePreference;
  /** The resolved scheme after applying the OS fallback. */
  colorScheme: ResolvedScheme;
  /** Persist a new choice. */
  setPreference: (preference: ThemePreference) => void;
  /** Convenience: advance light → dark → system → light. */
  cyclePreference: () => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceValue | null>(null);

const ORDER: ThemePreference[] = ['light', 'dark', 'system'];

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** Provides the resolved scheme + toggle to the whole app. Wrap the root navigator. */
export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme() ?? 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // Hydrate the stored choice once on start; default stays "system" until then.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && isThemePreference(stored)) setPreferenceState(stored);
      } catch {
        // Unreadable preference — keep the "system" default.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    // Fire-and-forget; a failed write just means it resets next launch.
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

/** Full preference state — for the toggle control. Must be inside the provider. */
export function useThemePreference(): ThemePreferenceValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return ctx;
}

/**
 * The resolved `light | dark` scheme. Safe to call outside the provider — it
 * falls back to the OS scheme — so color hooks never crash during early render.
 */
export function useResolvedColorScheme(): ResolvedScheme {
  const ctx = useContext(ThemePreferenceContext);
  const system = useSystemColorScheme() ?? 'light';
  return ctx ? ctx.colorScheme : system;
}
