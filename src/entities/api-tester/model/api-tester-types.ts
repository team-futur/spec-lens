import { type HttpMethod } from '@/entities/openapi';

export interface ResponseState {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}

export interface HistoryEntry {
  timestamp: number;
  method: HttpMethod;
  url: string;
  response: ResponseState | null;
  error: string | null;
}

export interface ApiTesterState {
  // Server
  selectedServer: string;

  // Request params
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  requestBody: string;

  // Response
  response: ResponseState | null;
  isExecuting: boolean;
  executeError: string | null;

  // History
  history: HistoryEntry[];
}

export interface ApiTesterActions {
  setSelectedServer: (server: string) => void;
  setPathParam: (key: string, value: string) => void;
  setQueryParam: (key: string, value: string) => void;
  setHeader: (key: string, value: string) => void;
  removeHeader: (key: string) => void;
  setRequestBody: (body: string) => void;
  setResponse: (response: ResponseState) => void;
  setExecuting: (executing: boolean) => void;
  setExecuteError: (error: string | null) => void;
  clearResponse: () => void;
  resetParams: () => void;
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

export type ApiTesterStore = ApiTesterState & ApiTesterActions;
