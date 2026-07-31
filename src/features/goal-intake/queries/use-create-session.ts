"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CreateSessionResponseSchema } from "@/lib/schemas/session";
import { setStoredSessionId } from "@/lib/session/restore";
import type { GoalInput } from "../types";

/**
 * POST /sessions. Never auto-retried (Rules.md §3) — a retry here would
 * create a duplicate session. On success we seed the ['session', id] cache
 * with the response so /discovery doesn't have to re-fetch the first
 * question (data-flow.md §4.1).
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalInput: GoalInput) =>
      apiPost("/sessions", CreateSessionResponseSchema, { goalInput }),
    onSuccess: (session) => {
      setStoredSessionId(session.sessionId);
      queryClient.setQueryData(queryKeys.session(session.sessionId), session);
    },
  });
}
