import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { darkColors, lightColors, type SemanticColors } from './color-tokens.ts';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

function getSystemPreference(): ResolvedThemeMode {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveMode(mode: ThemeMode): ResolvedThemeMode {
  return mode === 'system' ? getSystemPreference() : mode;
}

function resolveColors(resolved: ResolvedThemeMode): SemanticColors {
  return resolved === 'dark' ? darkColors : lightColors;
}

function applyToDocument(resolved: ResolvedThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', resolved);
}

type ThemeStore = {
  themeMode: ThemeMode;
  resolvedMode: ResolvedThemeMode;
  colors: SemanticColors;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => {
      const initialResolved = resolveMode('dark');
      return {
        themeMode: 'dark' as ThemeMode,
        resolvedMode: initialResolved,
        colors: resolveColors(initialResolved),

        setThemeMode: (mode: ThemeMode) => {
          const resolved = resolveMode(mode);
          applyToDocument(resolved);
          set({
            themeMode: mode,
            resolvedMode: resolved,
            colors: resolveColors(resolved),
          });
        },
      };
    },
    {
      name: 'theme',
      partialize: (state) => ({ themeMode: state.themeMode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveMode(state.themeMode);
          applyToDocument(resolved);
          state.resolvedMode = resolved;
          state.colors = resolveColors(resolved);
        }
      },
    },
  ),
);

export function initSystemThemeListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    const { themeMode } = useThemeStore.getState();
    if (themeMode === 'system') {
      const resolved = getSystemPreference();

      applyToDocument(resolved);
      useThemeStore.setState({
        resolvedMode: resolved,
        colors: resolveColors(resolved),
      });
    }
  };
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}
