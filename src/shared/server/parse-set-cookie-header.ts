export type ParsedCookie = {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
};

/**
 * Parse a Set-Cookie header string into a structured object
 */
export function parseSetCookieHeader(setCookieHeader: string): ParsedCookie | null {
  const parts = setCookieHeader.split(';').map((p) => p.trim());
  if (parts.length === 0) return null;

  // First part is name=value
  const [firstPart, ...attributes] = parts;
  const eqIndex = firstPart.indexOf('=');
  if (eqIndex === -1) return null;

  const name = firstPart.substring(0, eqIndex);
  const value = firstPart.substring(eqIndex + 1);

  const cookie: ParsedCookie = { name, value };

  // Parse attributes
  for (const attr of attributes) {
    const attrLower = attr.toLowerCase();
    if (attrLower === 'httponly') {
      cookie.httpOnly = true;
    } else if (attrLower === 'secure') {
      cookie.secure = true;
    } else if (attrLower.startsWith('path=')) {
      cookie.path = attr.substring(5);
    } else if (attrLower.startsWith('domain=')) {
      cookie.domain = attr.substring(7);
    } else if (attrLower.startsWith('expires=')) {
      cookie.expires = attr.substring(8);
    } else if (attrLower.startsWith('samesite=')) {
      cookie.sameSite = attr.substring(9);
    }
  }

  return cookie;
}
