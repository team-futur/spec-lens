import { create } from 'zustand';

import { type HistoryEntry } from './api-tester-types.ts';

// ========== History localStorage Functions ==========

const HISTORY_STORAGE_KEY = 'api-tester-history-v1';
const MAX_HISTORY_ENTRIES = 100;

function loadPersistedHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as HistoryEntry[];
    }
  } catch {
    // Ignore parse errors
  }
  return [];
}

function saveHistory(history: HistoryEntry[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Truncate large response data to prevent localStorage overflow
    const toSave = history.map((entry) => {
      if (!entry.response) return entry;

      // Check if data is too large when stringified
      const dataStr = JSON.stringify(entry.response.data);
      const isTooLarge = dataStr.length > 10000;

      return {
        ...entry,
        response: isTooLarge ? { ...entry.response, data: '[Response too large]' } : entry.response,
      };
    });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.warn('Failed to save history:', error);
  }
}

// ========== History Store ==========

export interface HistoryState {
  history: HistoryEntry[];
}

export interface HistoryActions {
  addToHistory: (entry: HistoryEntry) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

export type HistoryStore = HistoryState & { actions: HistoryActions };

const initialState: HistoryState = {
  history: loadPersistedHistory(),
};

export const useHistoryStore = create<HistoryStore>((set) => ({
  ...initialState,

  actions: {
    addToHistory: (entry: HistoryEntry) =>
      set((state) => {
        const newHistory = [entry, ...state.history].slice(0, MAX_HISTORY_ENTRIES);
        saveHistory(newHistory);
        return { history: newHistory };
      }),

    removeHistoryEntry: (id: string) =>
      set((state) => {
        const newHistory = state.history.filter((h) => h.id !== id);
        saveHistory(newHistory);
        return { history: newHistory };
      }),

    clearHistory: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      }
      return set({ history: [] });
    },
  },
}));

// Actions - can be used outside of React components
export const historyStoreActions = useHistoryStore.getState().actions;

// Selector hooks
export const useHistory = () => useHistoryStore((s) => s.history);
