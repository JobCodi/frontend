"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import {
  SubmitTurnResponseSchema,
  type Session,
  type SubmitTurnRequest,
} from "@/lib/schemas/session";
import { routeForStatus } from "@/lib/session/route-for-status";

/**
 * POST /sessions/:id/turns. Implements the optimistic-append-then-revert
 * pattern from data-flow.md §4.2: the answer lands in history immediately,
 * the turn slot clears (so the UI can show a typing indicator), and a
 * failure rolls the session cache back to its pre-submit snapshot.
 */
export function useSubmitTurn(sessionId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const sessionKey = queryKeys.session(sessionId);

  return useMutation({
    mutationFn: (vars: SubmitTurnRequest) =>
      // 30s hard timeout — screens.md's discovery loading spec treats a
      // turn that never resolves as an error rather than hanging forever.
      apiPost(`/sessions/${sessionId}/turns`, SubmitTurnResponseSchema, vars, {
        signal: AbortSignal.timeout(30_000),
      }),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: sessionKey });
      const previous = queryClient.getQueryData<Session>(sessionKey);

      queryClient.setQueryData<Session>(sessionKey, (old) => {
        if (!old || !old.turn) return old;
        const chosenLabel = vars.choiceValue
          ? old.turn.choices.find((c) => c.value === vars.choiceValue)?.label ?? vars.choiceValue
          : (vars.answer ?? "");
        return {
          ...old,
          turn: null,
          history: [
            ...old.history,
            {
              turnIndex: old.turn.turnIndex,
              prompt: old.turn.prompt,
              answerLabel: chosenLabel,
              fallback: old.turn.fallback,
              choices: old.turn.choices,
              allowFreeText: old.turn.allowFreeText,
            },
          ],
        };
      });

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(sessionKey, context.previous);
      }
      if (error instanceof ApiError && error.status === 422) {
        // TURN_BUDGET_EXCEEDED — the interview is over server-side even
        // though this submit failed; go review whatever criteria exist.
        router.push(`/discovery/${sessionId}/criteria`);
        return;
      }
      if (error instanceof ApiError && error.code === "SESSION_STATE_INVALID") {
        queryClient.invalidateQueries({ queryKey: sessionKey }).then(() => {
          const fresh = queryClient.getQueryData<Session>(sessionKey);
          if (fresh) router.replace(routeForStatus(fresh.status, sessionId));
        });
      }
    },

    onSuccess: (response) => {
      if (response.status === "interviewing") {
        queryClient.setQueryData<Session>(sessionKey, (old) =>
          old
            ? {
                ...old,
                status: "interviewing",
                turn: response.turn,
                remainingTurns: response.remainingTurns,
              }
            : old,
        );
        return;
      }

      queryClient.setQueryData(queryKeys.criteria(sessionId), response.criteria);
      queryClient.setQueryData<Session>(sessionKey, (old) =>
        old ? { ...old, status: "criteria_ready", turn: null } : old,
      );
      router.push(`/discovery/${sessionId}/criteria`);
    },
  });
}
