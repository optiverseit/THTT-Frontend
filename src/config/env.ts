declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

/**
 * Safely retrieve an environment variable.
 * Priority order:
 * 1. window.__ENV__ (loaded dynamically at runtime from server's .env.production via /env-config.php)
 * 2. import.meta.env (Vite build-time environment variable)
 * 3. Fallback default value
 */
export function getEnv(key: string, defaultValue = ""): string {
  if (typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  const metaVal = (import.meta.env as unknown as Record<string, string | undefined>)?.[key];
  if (metaVal) {
    return metaVal;
  }
  return defaultValue;
}

export function getApiBaseUrl(): string {
  return (
    getEnv("VITE_BASE_URL") ||
    "https://thtt-backend.triphimalaya.com.np/api"
  );
}

export function getBackendRootUrl(): string {
  return getApiBaseUrl()
    .replace(/\/api\/?$/i, "")
    .replace(/\/+$/, "");
}

export function getGoogleClientId(): string {
  return (
    getEnv("VITE_GOOGLE_CLIENT_ID") ||
    "178127958696-vk4jhq3sh9jk8ki3h92c7q832qtemlb5.apps.googleusercontent.com"
  );
}
