"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/schemas/auth";
import { clearUserServerCache } from "@/lib/query/clear-user-server-cache";
import { isCurrentAuthInitialization } from "./auth-initialization";
import { login as loginApi, register as registerApi, me as meApi, logout as logoutApi } from "./client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authInitializationGeneration = useRef(0);

  const invalidateAuthInitialization = useCallback(() => {
    authInitializationGeneration.current += 1;
  }, []);

  useEffect(() => {
    let isCurrentAuthentication = true;
    const requestGeneration = authInitializationGeneration.current;

    const canApplyInitialization = () => (
      isCurrentAuthentication
      && isCurrentAuthInitialization(requestGeneration, authInitializationGeneration.current)
    );

    meApi()
      .then((res) => {
        if (canApplyInitialization()) setUser(res.user);
      })
      .catch(() => {
        if (!canApplyInitialization()) return;
        clearUserServerCache(queryClient);
        setUser(null);
      })
      .finally(() => {
        if (canApplyInitialization()) setIsLoading(false);
      });

    return () => {
      isCurrentAuthentication = false;
    };
  }, [queryClient]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    invalidateAuthInitialization();
    setUser(result.user);
    setIsLoading(false);
  }, [invalidateAuthInitialization]);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await registerApi(email, password, displayName);
    invalidateAuthInitialization();
    setUser(result.user);
    setIsLoading(false);
  }, [invalidateAuthInitialization]);

  const logout = useCallback(async () => {
    await logoutApi();
    invalidateAuthInitialization();
    clearUserServerCache(queryClient);
    setUser(null);
    setIsLoading(false);
  }, [invalidateAuthInitialization, queryClient]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
