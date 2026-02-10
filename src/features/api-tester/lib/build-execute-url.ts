/**
 * Build the full URL with path parameters replaced
 */
export function buildExecuteUrl(
  baseUrl: string,
  path: string,
  pathParams: Record<string, string>,
): string {
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
