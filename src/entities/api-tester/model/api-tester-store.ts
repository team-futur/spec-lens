import { create } from 'zustand';

import { type ApiTesterState, type ApiTesterStore, type HistoryEntry } from './api-tester-types.ts';

const initialState: ApiTesterState = {
  selectedServer: '',
  pathParams: {},
  queryParams: {},
  headers: {
    'Content-Type': 'application/json',
  },
  requestBody: '',
  response: null,
  isExecuting: false,
  executeError: null,
  history: [],
};

export const useApiTesterStore = create<ApiTesterStore>((set) => ({
  ...initialState,

  setSelectedServer: (selectedServer) => set({ selectedServer }),

  setPathParam: (key, value) =>
    set((state) => ({
      pathParams: { ...state.pathParams, [key]: value },
    })),

  setQueryParam: (key, value) =>
    set((state) => ({
      queryParams: { ...state.queryParams, [key]: value },
    })),

  setHeader: (key, value) =>
    set((state) => ({
      headers: { ...state.headers, [key]: value },
    })),

  removeHeader: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.headers;
      return { headers: rest };
    }),

  setRequestBody: (requestBody) => set({ requestBody }),

  setResponse: (response) => set({ response, isExecuting: false, executeError: null }),

  setExecuting: (isExecuting) => set({ isExecuting }),

  setExecuteError: (executeError) => set({ executeError, isExecuting: false }),

  clearResponse: () => set({ response: null, executeError: null }),

  resetParams: () =>
    set({
      pathParams: {},
      queryParams: {},
      headers: { 'Content-Type': 'application/json' },
      requestBody: '',
      response: null,
      executeError: null,
    }),

  addToHistory: (entry: HistoryEntry) =>
    set((state) => ({
      history: [entry, ...state.history].slice(0, 50),
    })),

  clearHistory: () => set({ history: [] }),
}));

// Selector hooks
export const useSelectedServer = () => useApiTesterStore((s) => s.selectedServer);
export const usePathParams = () => useApiTesterStore((s) => s.pathParams);
export const useQueryParams = () => useApiTesterStore((s) => s.queryParams);
export const useHeaders = () => useApiTesterStore((s) => s.headers);
export const useRequestBody = () => useApiTesterStore((s) => s.requestBody);
export const useResponse = () => useApiTesterStore((s) => s.response);
export const useIsExecuting = () => useApiTesterStore((s) => s.isExecuting);
export const useExecuteError = () => useApiTesterStore((s) => s.executeError);
