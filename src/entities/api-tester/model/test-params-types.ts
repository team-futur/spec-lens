import type { ResponseState } from '@/shared/server';

export type EndpointTestData = {
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  requestBody: string;
  selectedServer: string;
  response: ResponseState | null;
};

export type PersistedTestParams = {
  [endpointKey: string]: EndpointTestData; // key: `${method}:${path}`
};
