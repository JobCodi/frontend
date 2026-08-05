"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import {
  SubmitTurnResponseSchema,
  type Session,
  type SubmitTurnRequest,
  type TurnQuestion,
} from "@/lib/schemas/session";
import type { CriteriaEnvelope } from "@/lib/schemas/criteria";
import { routeForStatus } from "@/lib/session/route-for-status";
import { setPendingTurn } from "./use-pending-turn";

/**
 * POST /sessions/:id/turns. Implements the optimistic-append-then-revert
 * pattern from data-flow.md §4.2: the answer lands in history immediately,
 * the pending question clears (so the UI can show a typing indicator), and
 * a failure rolls both caches back to their pre-submit snapshot.
 */
export function useSubmitTurn(sessionId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const sessionKey = queryKeys.session(sessionId);
  const pendingTurnKey = queryKeys.pendingTurn(sessionId);

  return useMutation({
    mutationFn: (vars: SubmitTurnRequest) => {
      const pendingTurn = queryClient.getQueryData<TurnQuestion | null>(pendingTurnKey) ?? null;
      const session = queryClient.getQueryData<Session>(sessionKey);
      const turnIndex = pendingTurn?.index ?? (session !== undefined ? session.turnIndex + 1 : undefined);
      return apiPost(`/sessions/${sessionId}/turns`, SubmitTurnResponseSchema, { ...vars, turnIndex }, {
        // 30s hard timeout — screens.md's discovery loading spec treats a
        // turn that never resolves as an error rather than hanging forever.
        signal: AbortSignal.timeout(30_000),
      });
    },

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: sessionKey });
      const previousSession = queryClient.getQueryData<Session>(sessionKey);
      const previousTurn = queryClient.getQueryData<TurnQuestion | null>(pendingTurnKey) ?? null;

      if (previousTurn) {
        const answerText = vars.answer
          ? vars.answer
          : (previousTurn.choices.find((choice) => choice.value === vars.choiceValue)?.label ??
            vars.choiceValue ??
            "");

        queryClient.setQueryData<Session>(sessionKey, (old) =>
          old
            ? {
                ...old,
                turnIndex: previousTurn.index,
                remainingTurns: Math.max(0, old.remainingTurns - 1),
                turns: [
                  ...old.turns,
                  {
                    index: previousTurn.index,
                    slot: previousTurn.slot,
                    question: previousTurn.question,
                    answer: answerText,
                  },
                ],
              }
            : old,
        );
      }

      setPendingTurn(queryClient, sessionId, null);

      return { previousSession, previousTurn };
    },

    onError: (error, _vars, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(sessionKey, context.previousSession);
      }
      setPendingTurn(queryClient, sessionId, context?.previousTurn ?? null);

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
        setPendingTurn(queryClient, sessionId, response.turn);
        queryClient.setQueryData<Session>(sessionKey, (old) =>
          old ? { ...old, status: "interviewing", remainingTurns: response.remainingTurns } : old,
        );
        // The answered turn only becomes authoritative (slot, exact stored
        // answer text) on the next GET; the optimistic append above can't
        // know it when the pending question was lost to a refresh.
        queryClient.invalidateQueries({ queryKey: sessionKey });
        return;
      }

      // `estimatedCount` arrives beside `criteria`, not inside it — flatten
      // into the envelope shape /criteria reads from its own GET.
      const envelope: CriteriaEnvelope = {
        ...response.criteria,
        estimatedCount: response.estimatedCount,
      };
      queryClient.setQueryData(queryKeys.criteria(sessionId), envelope);
      setPendingTurn(queryClient, sessionId, null);
      queryClient.setQueryData<Session>(sessionKey, (old) =>
        old ? { ...old, status: "criteria_ready" } : old,
      );
      router.push(`/discovery/${sessionId}/criteria`);
    },
  });
}
