import axios, { type AxiosError } from 'axios';

import type { ExecuteRequestParams, ExecuteRequestResult } from '../model/api-tester-types';

/**
 * Build the full URL with path parameters replaced
 */
function buildUrl(baseUrl: string, path: string, pathParams: Record<string, string>): string {
  let resolvedPath = path;

  // Replace {param} placeholders with actual values
  Object.entries(pathParams).forEach(([key, value]) => {
    resolvedPath = resolvedPath.replace(new RegExp(`\\{${key}\\}`, 'g'), encodeURIComponent(value));
  });

  // Remove trailing slash from baseUrl and leading slash from path if needed
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = resolvedPath.startsWith('/') ? resolvedPath : `/${resolvedPath}`;

  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * Parse request body if it's valid JSON
 */
function parseBody(body: string | undefined): unknown {
  if (!body || body.trim() === '') {
    return undefined;
  }

  try {
    return JSON.parse(body);
  } catch {
    // Return as string if not valid JSON
    return body;
  }
}

/**
 * Convert axios headers to plain object
 */
function headersToObject(headers: unknown): Record<string, string> {
  const result: Record<string, string> = {};

  if (headers && typeof headers === 'object') {
    Object.entries(headers as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result[key] = value;
      } else if (Array.isArray(value)) {
        result[key] = value.join(', ');
      }
    });
  }

  return result;
}

/**
 * Execute an API request
 */
export async function executeRequest(params: ExecuteRequestParams): Promise<ExecuteRequestResult> {
  const { baseUrl, path, method, pathParams, queryParams, headers, body } = params;

  const startTime = performance.now();

  try {
    const url = buildUrl(baseUrl, path, pathParams);
    const parsedBody = parseBody(body);

    // Filter out empty query params
    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== ''),
    );

    // Filter out empty headers
    const filteredHeaders = Object.fromEntries(
      Object.entries(headers).filter(([_, value]) => value !== ''),
    );

    const response = await axios({
      method,
      url,
      params: filteredQueryParams,
      headers: filteredHeaders,
      data: parsedBody,
      validateStatus: () => true, // Don't throw on non-2xx responses
      timeout: 30000, // 30 second timeout
    });

    const duration = performance.now() - startTime;

    return {
      success: true,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: headersToObject(response.headers),
        data: response.data,
        duration: Math.round(duration),
      },
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    const axiosError = error as AxiosError;

    let errorMessage = 'Request failed';

    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out';
    } else if (axiosError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. This might be caused by CORS policy.';
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }

    return {
      success: false,
      error: errorMessage,
      duration: Math.round(duration),
    };
  }
}
