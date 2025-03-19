"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner"; 
import { jwtDecode } from "jwt-decode"; 
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = parseCookies();
      setTokenState(cookies.auth_token || null); 
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
    } catch {
      toast.error("Token inválido.");
      setToken(null);
    }
  };

  const setToken = (newToken: string | null) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        const formattedToken = newToken.startsWith("Bearer ") ? newToken : `Bearer ${newToken}`;
        
        // Guardamos el token en las cookies
        setCookie(null, "auth_token", formattedToken, {
          maxAge: 60 * 60 * 24, // 1 día de duración
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
        });

        setTokenState(formattedToken);
        checkTokenAge(formattedToken);
        router.refresh();
      } else {
        destroyCookie(null, "auth_token");
        setTokenState(null);
      }
    }
  };

  const logout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    destroyCookie(null, "auth_token"); 
    setToken(null); 
    toast.info("Sesión cerrada.");
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
