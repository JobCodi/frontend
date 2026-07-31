"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { ApiError } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { routeForStatus } from "@/lib/session/route-for-status";
import type { TurnHistoryEntry } from "@/lib/schemas/session";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "../queries/use-session";
import { useSubmitTurn } from "../queries/use-submit-turn";
import { useTypingSlowHint } from "../hooks/use-typing-slow-hint";
import { QuestionPanel } from "./question-panel";
import { TurnHistoryList } from "./turn-history-list";

const TOTAL_TURNS = 5;

interface DiscoveryScreenProps {
  sessionId: string;
}

export function DiscoveryScreen({ sessionId }: DiscoveryScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, isLoading, isError, error, refetch } = useSession(sessionId);
  const submitTurn = useSubmitTurn(sessionId);
  const showSlowHint = useTypingSlowHint(submitTurn.isPending);

  // Defensive re-route: if the session's real status ever diverges from
  // "interviewing" (stale cache, 409-triggered refetch, direct nav to a
  // stale URL), send the user to the screen that owns that status —
  // lib/session/route-for-status.ts is the only place this mapping lives.
  useEffect(() => {
    if (session && session.status !== "interviewing") {
      router.replace(routeForStatus(session.status, sessionId));
    }
  }, [session, sessionId, router]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (isError || !session) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    if (isNotFound) {
      router.replace("/session-expired");
      return null;
    }
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <ErrorState
          title="대화를 불러오지 못했어요"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  function handleEditLastTurn(entry: TurnHistoryEntry) {
    queryClient.setQueryData(queryKeys.session(sessionId), (old: typeof session) =>
      old
        ? {
            ...old,
            history: old.history.filter((h) => h.turnIndex !== entry.turnIndex),
            turn: {
              turnIndex: entry.turnIndex,
              prompt: entry.prompt,
              choices: entry.choices,
              allowFreeText: entry.allowFreeText,
              fallback: entry.fallback,
            },
          }
        : old,
    );
  }

  const currentTurnNumber = session.turn
    ? session.turn.turnIndex
    : session.history.length;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8">
      <p className="mb-4 text-right text-xs font-medium text-[var(--text-subtle)]">
        {Math.min(currentTurnNumber, TOTAL_TURNS)}/{TOTAL_TURNS} 턴
      </p>

      {submitTurn.isError && !(submitTurn.error instanceof ApiError && submitTurn.error.status === 422) ? (
        <p role="alert" className="mb-4 rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          답변을 보내지 못했어요. 다시 시도해 주세요.
        </p>
      ) : null}

      <QuestionPanel
        turn={session.turn ?? null}
        isSubmitting={submitTurn.isPending}
        showSlowHint={showSlowHint}
        onSelectChoice={(value) => submitTurn.mutate({ choiceValue: value })}
        onSubmitFreeText={(text) => submitTurn.mutate({ answer: text })}
      />

      <TurnHistoryList
        history={session.history}
        onEditLastTurn={handleEditLastTurn}
        disabled={submitTurn.isPending}
      />
    </div>
  );
}
