"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/schemas/auth";
import { clearUserServerCache } from "@/lib/query/clear-user-server-cache";
import { getToken, clearToken, login as loginApi, register as registerApi, me as meApi } from "./client";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [isLoading, setIsLoading] = useState(() => getToken() !== null);

  useEffect(() => {
    let isCurrentAuthentication = true;

    if (token) {
      meApi()
        .then((res) => {
          if (isCurrentAuthentication) setUser(res.user);
        })
        .catch(() => {
          if (!isCurrentAuthentication) return;
          clearToken();
          clearUserServerCache(queryClient);
          setTokenState(null);
          setUser(null);
        })
        .finally(() => {
          if (isCurrentAuthentication) setIsLoading(false);
        });
    }

    return () => {
      isCurrentAuthentication = false;
    };
  }, [queryClient, token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    setTokenState(result.accessToken);
    setUser(result.user);
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await registerApi(email, password, displayName);
    setTokenState(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearUserServerCache(queryClient);
    setTokenState(null);
    setUser(null);
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
