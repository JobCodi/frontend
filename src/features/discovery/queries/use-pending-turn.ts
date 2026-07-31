"use client";

import { useQuery, type QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { TurnQuestion } from "@/lib/schemas/session";

/**
 * The question waiting for an answer.
 *
 * `GET /sessions/:id` deliberately returns answered turns only, so the
 * pending question exists in exactly two places: the `POST /sessions` and
 * `POST /sessions/:id/turns` responses. It is therefore cache-only —
 * `queryFn` resolves to null instead of hitting the network, and the
 * mutations write into this key. A hard refresh mid-interview loses it,
 * which /discovery handles explicitly.
 */
export function usePendingTurn(sessionId: string) {
  return useQuery<TurnQuestion | null>({
    queryKey: queryKeys.pendingTurn(sessionId),
    queryFn: () => Promise.resolve(null),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function setPendingTurn(
  queryClient: QueryClient,
  sessionId: string,
  turn: TurnQuestion | null,
): void {
  queryClient.setQueryData<TurnQuestion | null>(queryKeys.pendingTurn(sessionId), turn);
}
