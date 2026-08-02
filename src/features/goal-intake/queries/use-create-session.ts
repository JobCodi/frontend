"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { CreateSessionResponseSchema } from "@/lib/schemas/session";
import { setPendingTurn } from "@/features/discovery/queries/use-pending-turn";
import { setStoredSessionId } from "@/lib/session/restore";
import type { GoalInput } from "../types";

/**
 * POST /sessions. Never auto-retried (Rules.md §3) — a retry here would
 * create a duplicate session.
 *
 * The 201 body is NOT the `GET /sessions/:id` shape (no goalInput/turns),
 * so it can't seed the session cache; what it uniquely carries is the first
 * question, which no GET ever returns again. That goes into the pending-turn
 * cache instead.
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalInput: GoalInput) =>
      apiPost("/sessions", CreateSessionResponseSchema, { goalInput }),
    onSuccess: (session) => {
      setStoredSessionId(session.sessionId);
      setPendingTurn(queryClient, session.sessionId, session.turn);
    },
  });
}
