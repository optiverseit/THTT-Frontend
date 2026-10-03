import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  isSessionValid,
  touchSession,
  clearAuthSession,
  initSessionTracking,
  AUTH_STATE_CHANGE_EVENT,
} from "../utils/sessionManager";

interface User {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  nationality?: string;
  emergencyContact?: string;
  avatar?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization with 30-minute session validity check
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      if (!isSessionValid()) {
        clearAuthSession();
        return false;
      }
      return true;
    } catch {
      clearAuthSession();
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      if (!isSessionValid()) {
        return null;
      }
      const saved = localStorage.getItem("user");
      if (saved) return JSON.parse(saved);

      const name =
        localStorage.getItem("name") ||
        (localStorage.getItem("firstName")
          ? `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName") || ""}`.trim()
          : "");
      const email = localStorage.getItem("email") || "";
      if (name || email) {
        return { name, email };
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData?: User) => {
    const defaultUser = userData || { name: "Aniket Mandal", email: "aniket@gmail.com" };
    setIsLoggedIn(true);
    setUser(defaultUser);
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(defaultUser));
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", "dummy-demo-token");
      }
      if (defaultUser.name) {
        localStorage.setItem("name", defaultUser.name);
      }
      if (defaultUser.email) {
        localStorage.setItem("email", defaultUser.email);
      }
      touchSession();
      window.dispatchEvent(new CustomEvent(AUTH_STATE_CHANGE_EVENT, { detail: { loggedIn: true } }));
    } catch (e) {
      console.warn("[AuthContext] Unable to persist auth to localStorage", e);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    clearAuthSession();
  }, []);

  const refreshSession = useCallback(() => {
    if (isSessionValid()) {
      touchSession();
    } else {
      logout();
    }
  }, [logout]);

  // Session activity tracking & auto-logout after 30 minutes of inactivity
  useEffect(() => {
    const cleanupTracking = initSessionTracking(() => {
      console.log("[AuthContext] Session expired due to 30 minutes of inactivity. Logging out.");
      setIsLoggedIn(false);
      setUser(null);
    });

    const handleCustomAuthChange = (e: Event) => {
      const custom = e as CustomEvent<{ loggedIn: boolean }>;
      if (custom.detail?.loggedIn === false) {
        setIsLoggedIn(false);
        setUser(null);
      } else if (custom.detail?.loggedIn === true) {
        setIsLoggedIn(true);
        try {
          const saved = localStorage.getItem("user");
          setUser(saved ? JSON.parse(saved) : null);
        } catch {
          // ignore
        }
      }
    };

    const handleStorage = () => {
      try {
        if (!isSessionValid()) {
          setIsLoggedIn(false);
          setUser(null);
        } else {
          setIsLoggedIn(true);
          const saved = localStorage.getItem("user");
          setUser(saved ? JSON.parse(saved) : null);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener(AUTH_STATE_CHANGE_EVENT, handleCustomAuthChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      cleanupTracking();
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, handleCustomAuthChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
