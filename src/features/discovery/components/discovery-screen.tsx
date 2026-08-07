"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
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

  useEffect(() => {
    if (session && session.status !== "interviewing") {
      router.replace(routeForStatus(session.status, sessionId));
    }
  }, [session, sessionId, router]);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-4 h-28 w-full" />
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
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
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
  const progressPct = Math.min(100, Math.round((Math.min(currentTurnNumber, TOTAL_TURNS) / TOTAL_TURNS) * 100));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-elevated)]">
        <div className="border-b border-[var(--line)] bg-gradient-to-br from-white via-[var(--brand-soft)]/35 to-[#f3e8ff]/40 px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                  Step 2 · Discovery
                </p>
                <p className="mt-0.5 text-lg font-semibold text-[var(--text)]">AI 대화로 조건 정교화</p>
                <p className="text-sm text-[var(--text-muted)]">맞춤 공고를 찾기 위해 짧게 질문하고 있어요</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur sm:min-w-[140px]">
              <p className="text-xs font-medium text-[var(--text-subtle)]">진행률</p>
              <p className="mt-1 text-lg font-semibold text-[var(--brand)]">
                {Math.min(currentTurnNumber, TOTAL_TURNS)}
                <span className="text-sm text-[var(--text-subtle)]">/{TOTAL_TURNS}</span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          {submitTurn.isError &&
          !(submitTurn.error instanceof ApiError && submitTurn.error.status === 422) ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p role="alert" className="text-sm text-red-700">
                답변을 보내지 못했어요. 다시 시도해 주세요.
              </p>
            </div>
          ) : null}

          {questionLost ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">
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
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/50 p-4">
              <FreeTextInput
                disabled={submitTurn.isPending}
                onSubmit={(text) => submitTurn.mutate({ answer: text })}
              />
            </div>
          ) : null}

          <TurnHistoryList turns={session.turns} />
        </div>
      </section>
    </div>
  );
}
