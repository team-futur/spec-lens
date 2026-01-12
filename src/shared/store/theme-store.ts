import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: 'light',
      setThemeMode: (theme) => {
        set({ themeMode: theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.themeMode);
        }
      },
    },
  ),
);
