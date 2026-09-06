import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name?: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (userData?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isLoggedIn") === "true";
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData?: User) => {
    const defaultUser = userData || { name: "Traveler", email: "user@triphimalaya.com.np" };
    setIsLoggedIn(true);
    setUser(defaultUser);
    try {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(defaultUser));
    } catch (e) {
      console.warn("[AuthContext] Unable to persist auth to localStorage", e);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("[AuthContext] Unable to remove auth from localStorage", e);
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      try {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        const saved = localStorage.getItem("user");
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        // Fallback silently if storage event had corrupted data
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
