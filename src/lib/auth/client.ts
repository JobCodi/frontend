"use client";

import { apiFetch } from "@/lib/api/client";
import { z } from "zod";
import type { AuthResponse, MeResponse } from "@/lib/schemas/auth";
import { AuthResponseSchema, MeResponseSchema } from "@/lib/schemas/auth";

export async function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/register", { method: "POST", schema: AuthResponseSchema, body: { email, password, displayName } });
  return result;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await apiFetch("/auth/login", { method: "POST", schema: AuthResponseSchema, body: { email, password } });
  return result;
}

export async function me(): Promise<MeResponse> {
  return apiFetch("/auth/me", { method: "GET", schema: MeResponseSchema });
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST", schema: z.undefined() });
}
