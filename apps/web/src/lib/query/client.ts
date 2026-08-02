import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/client";

/**
 * Shared QueryClient defaults. Retries are handled inside `apiFetch` itself
 * (GET x2, POST x0 — see lib/api/client.ts), so TanStack Query's own retry
 * is disabled to avoid retrying on top of retries.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function isSessionNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
