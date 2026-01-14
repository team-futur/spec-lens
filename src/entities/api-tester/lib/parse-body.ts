/**
 * Parse request body if it's valid JSON
 */
export function parseBody(body: string | undefined): unknown {
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
