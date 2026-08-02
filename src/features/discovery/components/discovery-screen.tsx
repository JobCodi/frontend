"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { ApiError } from "@/lib/api/client";
import { routeForStatus } from "@/lib/session/route-for-status";
import { useSession } from "../queries/use-session";
import { usePendingTurn } from "../queries/use-pending-turn";
import { useSubmitTurn } from "../queries/use-submit-turn";
import { useTypingSlowHint } from "../hooks/use-typing-slow-hint";
import { QuestionPanel } from "./question-panel";
import { FreeTextInput } from "./free-text-input";
import { TurnHistoryList } from "./turn-history-list";

const TOTAL_TURNS = 5;

interface DiscoveryScreenProps {
  sessionId: string;
}

export function DiscoveryScreen({ sessionId }: DiscoveryScreenProps) {
  const router = useRouter();
  const { data: session, isLoading, isError, error, refetch } = useSession(sessionId);
  const { data: pendingTurn } = usePendingTurn(sessionId);
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

  const currentTurnNumber = pendingTurn ? pendingTurn.index : session.turnIndex;
  // The pending question only exists in the create/submit responses; after a
  // hard refresh there is nothing to re-fetch it from.
  const questionLost = !pendingTurn && !submitTurn.isPending;

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

      {questionLost ? (
        <div className="mb-4 flex flex-col items-start gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-muted)]">
            새로고침하면 진행 중이던 질문을 다시 불러올 수 없어요. 아래에 답변을 입력하면 대화를
            이어갈 수 있고, 처음부터 다시 시작할 수도 있어요.
          </p>
          <Button size="sm" variant="secondary" asChild>
            <Link href="/start">처음부터 다시 시작하기</Link>
          </Button>
        </div>
      ) : null}

      <QuestionPanel
        turn={pendingTurn ?? null}
        isSubmitting={submitTurn.isPending}
        showSlowHint={showSlowHint}
        onSelectChoice={(value) => submitTurn.mutate({ choiceValue: value })}
        onSubmitFreeText={(text) => submitTurn.mutate({ answer: text })}
      />

      {questionLost ? (
        <FreeTextInput
          disabled={submitTurn.isPending}
          onSubmit={(text) => submitTurn.mutate({ answer: text })}
        />
      ) : null}

      <TurnHistoryList turns={session.turns} />
    </div>
  );
}
