import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem("isLoggedIn") === "true" ||
        !!localStorage.getItem("token")
      );
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) return JSON.parse(saved);
      const name =
        localStorage.getItem("name") ||
        (localStorage.getItem("firstName")
          ? `${localStorage.getItem("firstName")} ${localStorage.getItem("lastName") || ""}`.trim()
          : "");
      const email = localStorage.getItem("email") || "";
      if (name || email) {
        return { name: name || "Aniket Mandal", email };
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (userData?: User) => {
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
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("email");
      localStorage.removeItem("phone");
      localStorage.removeItem("avatar");
      localStorage.removeItem("gender");
      localStorage.removeItem("address");
      localStorage.removeItem("nationality");
      localStorage.removeItem("emergencyContact");
      localStorage.removeItem("role");
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
