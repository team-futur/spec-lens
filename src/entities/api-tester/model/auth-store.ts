import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type AuthConfig } from './api-tester-types.ts';

export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  type: 'none',
  apiKeyLocation: 'header',
  persistSession: false,
};

export type AuthState = {
  authConfig: AuthConfig;
};

export type AuthActions = {
  setAuthConfig: (config: Partial<AuthConfig>) => void;
  clearAuth: () => void;
};

export type AuthStore = AuthState & { actions: AuthActions };

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      authConfig: DEFAULT_AUTH_CONFIG,

      actions: {
        setAuthConfig: (config) =>
          set((state) => ({
            authConfig: { ...state.authConfig, ...config },
          })),

        clearAuth: () => set({ authConfig: DEFAULT_AUTH_CONFIG }),
      },
    }),
    {
      name: 'api-tester-auth',
      version: 1,
      partialize: (state) =>
        state.authConfig.persistSession ? { authConfig: state.authConfig } : {},
    },
  ),
);

// Actions - can be used outside of React components
export const authStoreActions = useAuthStore.getState().actions;

// Selector hooks
export const useAuthConfig = () => useAuthStore((s) => s.authConfig);
