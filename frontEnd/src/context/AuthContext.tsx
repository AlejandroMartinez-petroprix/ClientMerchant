"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTokenState(localStorage.getItem("token"));
    }
  }, []);

  const setToken = (newToken: string | null) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        const formattedToken = newToken.startsWith("Bearer ") ? newToken : `Bearer ${newToken}`;
        localStorage.setItem("token", formattedToken);
        setTokenState(formattedToken);
      } else {
        localStorage.removeItem("token");
        setTokenState(null);
      }
    }
  };

  const logout = () => {
    setToken(null);
    message.info("Sesión cerrada.");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
