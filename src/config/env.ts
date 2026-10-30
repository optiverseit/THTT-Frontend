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
  // 1. Localhost detection: automatically route to Render backend API
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("192.168.")
    ) {
      return "https://thtt-backend.onrender.com/api";
    }
  }

  // 2. Server runtime config (e.g. from /env-config.php on cPanel hosting)
  if (
    typeof window !== "undefined" &&
    window.__ENV__ &&
    window.__ENV__["VITE_BASE_URL"]
  ) {
    return window.__ENV__["VITE_BASE_URL"];
  }

  // 3. Live production domain check for triphimalaya.com.np
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("triphimalaya.com.np")) {
      return "https://thtt-backend.triphimalaya.com.np/api";
    }
  }

  // 4. Build-time environment variable
  const metaVal = (import.meta.env as unknown as Record<string, string | undefined>)?.[
    "VITE_BASE_URL"
  ];
  if (metaVal) {
    return metaVal;
  }

  // 5. Default production backend for cPanel deployment
  return "https://thtt-backend.triphimalaya.com.np/api";
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
