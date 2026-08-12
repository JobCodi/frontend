"use client";

import { apiFetch } from "@/lib/api/client";
import { z } from "zod";
import type { AuthResponse, MeResponse } from "@/lib/schemas/auth";
import { AuthResponseSchema, MeResponseSchema } from "@/lib/schemas/auth";
import { clearAccessToken, setAccessToken } from "./access-token";

let refreshPromise: Promise<AuthResponse> | null = null;

export async function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/register", { method: "POST", schema: AuthResponseSchema, body: { email, password, displayName } });
  setAccessToken(result.accessToken, result.expiresAt);
  return result;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/login", { method: "POST", schema: AuthResponseSchema, body: { email, password } });
  setAccessToken(result.accessToken, result.expiresAt);
  return result;
}

export function refresh(): Promise<AuthResponse> {
  if (refreshPromise === null) {
    refreshPromise = apiFetch("/auth/refresh", { method: "POST", schema: AuthResponseSchema })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function me(): Promise<MeResponse> {
  return apiFetch("/auth/me", { method: "GET", schema: MeResponseSchema });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST", schema: z.undefined() });
  } finally {
    clearAccessToken();
  }
}
