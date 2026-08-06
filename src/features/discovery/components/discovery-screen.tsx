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
import { MessageCircle } from "lucide-react";

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

  useEffect(() => {
    if (session && session.status !== "interviewing") {
      router.replace(routeForStatus(session.status, sessionId));
    }
  }, [session, sessionId, router]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-3/4" />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Skeleton className="h-10 w-2/3" />
        </div>
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
  const questionLost = !pendingTurn && !submitTurn.isPending;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI 대화 진행 중</p>
            <p className="text-xs text-gray-500">맞춤 공고를 찾기 위해 질문하고 있어요</p>
          </div>
        </div>
        <p className="text-sm font-bold text-indigo-600">
          {Math.min(currentTurnNumber, TOTAL_TURNS)}/{TOTAL_TURNS}
        </p>
      </div>

      {submitTurn.isError && !(submitTurn.error instanceof ApiError && submitTurn.error.status === 422) ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p role="alert" className="text-sm text-red-700">
            답변을 보내지 못했어요. 다시 시도해 주세요.
          </p>
        </div>
      ) : null}

      {questionLost ? (
        <div className="mb-4 flex flex-col items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">
            새로고침하면 진행 중이던 질문을 다시 불러올 수 없어요. 아래에 답변을 입력하면 대화를
            이어갈 수 있고, 처음부터 다시 시작할 수도 있어요.
          </p>
          <Button size="sm" variant="secondary" asChild className="rounded-lg">
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
        <div className="mt-6">
          <FreeTextInput
            disabled={submitTurn.isPending}
            onSubmit={(text) => submitTurn.mutate({ answer: text })}
          />
        </div>
      ) : null}

      <TurnHistoryList turns={session.turns} />
    </div>
  );
}
