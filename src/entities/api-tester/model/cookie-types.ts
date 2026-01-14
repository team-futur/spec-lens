export type CustomCookie = {
  name: string;
  value: string;
  enabled: boolean;
};

export type SessionCookie = {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  expires?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
};

type CookieState = {
  customCookies: CustomCookie[];
  sessionCookies: SessionCookie[];
};

type CookieActions = {
  // Custom Cookies
  addCustomCookie: (cookie: CustomCookie) => void;
  updateCustomCookie: (index: number, cookie: Partial<CustomCookie>) => void;
  removeCustomCookie: (index: number) => void;
  clearCustomCookies: () => void;
  // Session Cookies
  setSessionCookies: (cookies: SessionCookie[]) => void;
  addSessionCookies: (cookies: SessionCookie[]) => void;
  clearSessionCookies: () => void;
  removeExpiredCookies: () => number;
};

export type CookieStore = CookieState & { actions: CookieActions };
