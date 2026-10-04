/**
 * Session & Inactivity Management for Trip Himalaya (THTT)
 * 
 * - 30-minute idle session timeout
 * - Browser close / reopen validation
 * - JWT token expiration validation
 * - Activity tracking (mouse, key, touch, scroll)
 * - Safe auth state clearing
 */

export const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
export const SESSION_LAST_ACTIVE_KEY = "thtt_session_last_active";
export const SESSION_EXPIRES_AT_KEY = "thtt_session_expires_at";
export const SESSION_ACTIVE_TAB_KEY = "thtt_session_active_tab";
export const AUTH_STATE_CHANGE_EVENT = "thtt_auth_state_changed";

const AUTH_STORAGE_KEYS = [
  "isLoggedIn",
  "token",
  "refreshToken",
  "user",
  "userId",
  "user_id",
  "id",
  "role",
  "roleName",
  "email",
  "name",
  "firstName",
  "lastName",
  "phone",
  "gender",
  "address",
  "nationality",
  "additionalNumber",
  "emergencyContact",
  "avatar",
  "phoneVerified",
  SESSION_LAST_ACTIVE_KEY,
  SESSION_EXPIRES_AT_KEY,
];

/**
 * Safely parse a JWT without external libraries to check if exp claim has passed.
 */
export const isJwtExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      // Non-JWT token (e.g., test/mock token) — handled by session timestamp
      return false;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    if (parsed && typeof parsed.exp === "number") {
      // exp is in seconds, Date.now() in ms. 10s grace window.
      return Date.now() >= parsed.exp * 1000 - 10000;
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Checks if the user's current session is still valid (not expired by inactivity or token expiration).
 */
export const isSessionValid = (): boolean => {
  try {
    const token = localStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn") === "true";

    // If no token and not flagged as logged in, no session
    if (!token && !isLoggedInFlag) {
      return false;
    }

    // Check JWT expiration if JWT
    if (token && isJwtExpired(token)) {
      return false;
    }

    const lastActiveStr = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);
    if (!lastActiveStr) {
      // No active session timestamp recorded
      return false;
    }

    const lastActive = parseInt(lastActiveStr, 10);
    if (Number.isNaN(lastActive)) {
      return false;
    }

    // If more than 30 minutes have elapsed since last activity -> expired
    const elapsed = Date.now() - lastActive;
    if (elapsed > SESSION_DURATION_MS) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Refreshes the last active timestamp for the 30-minute sliding window.
 */
export const touchSession = (): void => {
  try {
    const token = localStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn") === "true";
    if (!token && !isLoggedInFlag) return;

    const now = Date.now();
    localStorage.setItem(SESSION_LAST_ACTIVE_KEY, now.toString());
    localStorage.setItem(SESSION_EXPIRES_AT_KEY, (now + SESSION_DURATION_MS).toString());
    sessionStorage.setItem(SESSION_ACTIVE_TAB_KEY, "true");
  } catch (e) {
    console.warn("[SessionManager] touchSession error:", e);
  }
};

/**
 * Completely and safely clears all authentication session data from storage.
 */
export const clearAuthSession = (): void => {
  try {
    AUTH_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    sessionStorage.removeItem(SESSION_ACTIVE_TAB_KEY);

    // Notify all active React contexts / components across tabs
    window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT, { detail: { loggedIn: false } }));
  } catch (e) {
    console.warn("[SessionManager] clearAuthSession error:", e);
  }
};

/**
 * Sets up user interaction listeners and interval checks for 30-minute idle timeout.
 * Returns an unmount / cleanup function.
 */
export const initSessionTracking = (onSessionExpire: () => void): (() => void) => {
  let throttleTimer: number | null = null;

  const handleUserActivity = () => {
    // Throttle activity updates to once every 10 seconds to keep performance optimal
    if (throttleTimer) return;

    throttleTimer = window.setTimeout(() => {
      throttleTimer = null;
    }, 10000);

    const token = localStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn") === "true";
    if (!token && !isLoggedInFlag) return;

    // Check if session has already expired before touching
    if (!isSessionValid()) {
      clearAuthSession();
      onSessionExpire();
      return;
    }

    touchSession();
  };

  const activityEvents: Array<keyof WindowEventMap> = [
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click",
  ];

  activityEvents.forEach((ev) => {
    window.addEventListener(ev, handleUserActivity, { passive: true });
  });

  // Check periodically (every 15 seconds) if 30 minutes expired while idle
  const intervalId = window.setInterval(() => {
    const token = localStorage.getItem("token");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn") === "true";
    if (!token && !isLoggedInFlag) return;

    if (!isSessionValid()) {
      clearAuthSession();
      onSessionExpire();
    }
  }, 15000);

  // When user switches back to the tab or un-minimizes the browser
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const token = localStorage.getItem("token");
      const isLoggedInFlag = localStorage.getItem("isLoggedIn") === "true";
      if (!token && !isLoggedInFlag) return;

      if (!isSessionValid()) {
        clearAuthSession();
        onSessionExpire();
      } else {
        touchSession();
      }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleVisibilityChange);

  return () => {
    if (throttleTimer) clearTimeout(throttleTimer);
    clearInterval(intervalId);
    activityEvents.forEach((ev) => {
      window.removeEventListener(ev, handleUserActivity);
    });
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("focus", handleVisibilityChange);
  };
};
