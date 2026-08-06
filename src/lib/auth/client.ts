"use client";

import { apiFetch } from "@/lib/api/client";
import type { AuthResponse, MeResponse } from "@/lib/schemas/auth";
import { AuthResponseSchema, MeResponseSchema } from "@/lib/schemas/auth";

const TOKEN_KEY = "jobcodi_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  // Also set cookie for SSR middleware
  document.cookie = `jobcodi_token=${token}; path=/; max-age=2592000; samesite=lax`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = "jobcodi_token=; path=/; max-age=0";
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/register", { method: "POST", schema: AuthResponseSchema, body: { email, password, displayName } });
  setToken(result.accessToken);
  return result;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/login", { method: "POST", schema: AuthResponseSchema, body: { email, password } });
  setToken(result.accessToken);
  return result;
}

export async function me(): Promise<MeResponse> {
  return apiFetch("/auth/me", { method: "GET", schema: MeResponseSchema, headers: authHeaders() });
}

export async function logout(): Promise<void> {
  clearToken();
}
