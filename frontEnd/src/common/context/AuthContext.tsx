"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; 
import {jwtDecode} from "jwt-decode"; 

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

  const checkTokenAge = (newToken: string) => {
    try {
      const decoded: { age: number } = jwtDecode(newToken);
      const age = decoded.age;

      if (age < 18) {
        toast.error("Cliente <18 - Acceso restringido.");
        setToken(null);
      } else {
        toast.success("Cliente >18 - Acceso permitido.");
      }
    } catch  {
      toast.error("Token inválido.");
      setToken(null);
    }
  };

  const setToken = (newToken: string | null) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        const formattedToken = newToken.startsWith("Bearer ") ? newToken : `Bearer ${newToken}`;
        localStorage.setItem("token", formattedToken);
        setTokenState(formattedToken);

        checkTokenAge(formattedToken);
      } else {
        localStorage.removeItem("token");
        setTokenState(null);
      }
    }
  };

  const logout = () => {
    setToken(null);
    toast.info("🔓 Sesión cerrada.");
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
