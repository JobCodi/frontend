"use client";

import { Info, ListChecks, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import {
  CRITERIA_FIELD_KEYS,
  DISCOVERY_SLOT_LABEL,
  type CriteriaEnvelope,
  type CriteriaFieldKey,
  type PatchCriteriaRequest,
} from "@/lib/schemas/criteria";
import type { Taxonomy } from "@/lib/schemas/taxonomy";
import { useCriteria } from "../queries/use-criteria";
import { usePatchCriteria } from "../queries/use-patch-criteria";
import { useConfirmCriteria } from "../queries/use-confirm-criteria";
import { useCriteriaEditStore } from "../stores/criteria-edit-store";
import { CriteriaRow } from "./criteria-row";
import { EstimatedCount } from "./estimated-count";

interface CriteriaScreenProps {
  sessionId: string;
  taxonomy: Taxonomy;
  initialCriteria?: CriteriaEnvelope;
}

export function CriteriaScreen({ sessionId, taxonomy, initialCriteria }: CriteriaScreenProps) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useCriteria(sessionId, initialCriteria);
  const patchCriteria = usePatchCriteria(sessionId);
  const confirmCriteria = useConfirmCriteria(sessionId);
  const cancelEdit = useCriteriaEditStore((s) => s.cancelEdit);
  const isSessionNotFound = error instanceof ApiError
    && (error.code === "SESSION_NOT_FOUND" || error.status === 404);

  useEffect(() => {
    if (isSessionNotFound) {
      router.replace("/session-expired");
    }
  }, [isSessionNotFound, router]);

  if (isError) {
    if (isSessionNotFound) return null;
    return (
      <div className="ui-page ui-page-narrow">
        <ErrorState title="조건을 불러오지 못했어요" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="ui-page ui-page-narrow flex flex-col gap-4">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-4 h-40 w-full" />
        </div>
      </div>
    );
  }

  function handleSave(patch: PatchCriteriaRequest) {
    patchCriteria.mutate(patch, { onSuccess: () => cancelEdit() });
  }

  return (
    <div className="ui-page ui-page-narrow flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl border border-[var(--line)]/80 bg-white shadow-[var(--shadow-elevated)]">
        <div className="relative border-b border-[var(--line)]/80 px-5 py-6 sm:px-7">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-[var(--brand-soft)]/25 to-[#f3e8ff]/35" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.3)]">
              <ListChecks className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">
                  Step 3
                </span>
                <span className="text-xs text-[var(--text-subtle)]">Criteria</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                이 조건으로 공고를 모아올게요.
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                <EstimatedCount count={data.estimatedCount} /> · 마음에 안 드는 항목은 바로 고쳐주세요
              </p>
            </div>
          </div>
        </div>

        {data.rationale ? (
          <div className="mx-5 mt-5 flex gap-3 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-soft)]/70 p-4 sm:mx-7">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
            <p className="text-sm leading-6 text-[var(--text)]">{data.rationale}</p>
          </div>
        ) : null}

        <div className="px-5 py-5 sm:px-7">
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)]/40">
            {CRITERIA_FIELD_KEYS.map((field: CriteriaFieldKey) => (
              <CriteriaRow
                key={field}
                field={field}
                criteria={data.payload}
                source={data.sources[field]}
                taxonomy={taxonomy}
                onSave={handleSave}
                isSaving={patchCriteria.isPending}
              />
            ))}
          </div>

          {data.unfilledSlots.length > 0 ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--line)] bg-white p-3 text-sm text-[var(--text-muted)]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden="true" />
              <span>
                {data.unfilledSlots.map((slot) => `'${DISCOVERY_SLOT_LABEL[slot] ?? slot}'`).join(", ")}
                는 대화에서 정해지지 않아 기본값을 사용했어요.
              </span>
            </p>
          ) : null}

          {patchCriteria.isError ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              조건을 저장하지 못했어요. 다시 시도해 주세요.
            </p>
          ) : null}

          {confirmCriteria.isError ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              조건을 확정하지 못했어요. 다시 시도해 주세요.
            </p>
          ) : null}
        </div>

        <div className="sticky bottom-0 border-t border-[var(--line)] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              확정하면 여러 채용 소스에서 공고를 모아 매칭 점수 순으로 보여드려요.
            </p>
            <Button
              size="lg"
              onClick={() => confirmCriteria.mutate()}
              disabled={confirmCriteria.isPending}
              className="rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] px-7 text-white shadow-lg shadow-[rgba(84,69,244,0.25)] hover:brightness-105"
            >
              {confirmCriteria.isPending ? "확정하는 중..." : "이 조건으로 공고 모으기 →"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
