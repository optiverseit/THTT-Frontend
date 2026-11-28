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
  // 1. In local development (localhost / private network), use Render API
  if (isLocalEnvironment()) {
    const localMetaVal = (import.meta.env as unknown as Record<string, string | undefined>)?.[
      "VITE_BASE_URL"
    ];
    if (localMetaVal) {
      return localMetaVal;
    }
    return "https://thtt-backend.onrender.com/api";
  }

  // 2. Server runtime config (e.g. from /env-config.php on cPanel hosting)
  if (
    typeof window !== "undefined" &&
    window.__ENV__ &&
    window.__ENV__["VITE_BASE_URL"] &&
    !window.__ENV__["VITE_BASE_URL"].includes("onrender.com")
  ) {
    return window.__ENV__["VITE_BASE_URL"];
  }

  // 3. Build-time environment variable (ignoring onrender.com on live deployments)
  const metaVal = (import.meta.env as unknown as Record<string, string | undefined>)?.[
    "VITE_BASE_URL"
  ];
  if (metaVal && !metaVal.includes("onrender.com")) {
    return metaVal;
  }

  // 4. Reliable live production backend for Vercel and Live deployments
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

/**
 * Returns true if running in local development (localhost / private network),
 * and false on live production domains (triphimalaya.com.np).
 */
export function isLocalEnvironment(): boolean {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("triphimalaya.com.np")) {
      return false;
    }
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.endsWith(".local")
    ) {
      return true;
    }
  }
  return Boolean(import.meta.env.DEV);
}

