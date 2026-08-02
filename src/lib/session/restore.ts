"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { SessionSchema, type Session } from "@/lib/schemas/session";
import { routeForStatus } from "./route-for-status";

export const SESSION_STORAGE_KEY = "jobcodi.session";

const storageListeners = new Set<() => void>();

function notifyStorageListeners() {
  storageListeners.forEach((listener) => listener());
}

function subscribeToStorage(listener: () => void) {
  storageListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    storageListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getStoredSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_STORAGE_KEY);
}

export function setStoredSessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  notifyStorageListeners();
}

export function clearStoredSessionId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  notifyStorageListeners();
}

function getServerSessionIdSnapshot(): string | null {
  return null;
}

/**
 * SSR-safe read of the stored session id. Matches the server-rendered
 * `null` snapshot on first paint, then syncs to the real value right after
 * hydration — avoids a hydration mismatch from reading localStorage
 * directly during render.
 */
export function useStoredSessionId(): string | null {
  return useSyncExternalStore(
    subscribeToStorage,
    getStoredSessionId,
    getServerSessionIdSnapshot,
  );
}

export interface ContinueSessionState {
  status: "idle" | "loading" | "found" | "expired" | "none";
  session: Session | null;
  destination: string | null;
}

/**
 * Drives the "이어서 하기" banner on `/`. Reads the session id out of
 * localStorage (client-only), fetches its current status, and clears the
 * stored id when the session has expired (404) — sitemap.md §4.
 */
export function useContinueSession(): ContinueSessionState {
  const sessionId = useStoredSessionId();

  const query = useQuery({
    queryKey: sessionId ? queryKeys.session(sessionId) : ["continue-session", "none"],
    queryFn: () => apiGet(`/sessions/${sessionId}`, SessionSchema),
    enabled: sessionId !== null,
    retry: false,
    staleTime: 0,
  });

  if (!sessionId) {
    return { status: "none", session: null, destination: null };
  }

  if (query.isLoading) {
    return { status: "loading", session: null, destination: null };
  }

  if (query.isError) {
    clearStoredSessionId();
    return { status: "expired", session: null, destination: null };
  }

  if (query.data) {
    if (query.data.status === "abandoned") {
      clearStoredSessionId();
      return { status: "expired", session: null, destination: null };
    }
    return {
      status: "found",
      session: query.data,
      destination: routeForStatus(query.data.status, query.data.sessionId),
    };
  }

  return { status: "idle", session: null, destination: null };
}
