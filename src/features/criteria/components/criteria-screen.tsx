"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api/client";
import { useSession } from "@/lib/session/use-session";
import type { CriteriaEnvelope, CriteriaFieldKey } from "@/lib/schemas/criteria";
import type { Taxonomy } from "@/lib/schemas/taxonomy";
import { useRouter } from "next/navigation";
import { CRITERIA_FIELD_KEYS } from "@/lib/schemas/criteria";
import { CRITERIA_FIELD_LABEL } from "../types";
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
  const { data: session } = useSession(sessionId);
  const { data, isLoading, isError, error, refetch } = useCriteria(sessionId, initialCriteria);
  const patchCriteria = usePatchCriteria(sessionId);
  const confirmCriteria = useConfirmCriteria(sessionId);
  const cancelEdit = useCriteriaEditStore((s) => s.cancelEdit);

  if (isLoading || !data) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-8">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    const notFound = error instanceof ApiError && error.status === 404;
    if (notFound) {
      router.replace("/session-expired");
      return null;
    }
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <ErrorState title="조건을 불러오지 못했어요" onRetry={() => refetch()} />
      </div>
    );
  }

  function handleSave(patch: Partial<CriteriaEnvelope["criteria"]>) {
    patchCriteria.mutate(patch, { onSuccess: () => cancelEdit() });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-[22px] font-semibold leading-[30px] text-[var(--text)]">
          이 조건으로 공고를 모아올게요.
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          <EstimatedCount count={data.estimatedCount} /> · 마음에 안 드는 항목은 고쳐주세요
        </p>
      </div>

      {session?.degraded ? (
        <p className="rounded-[var(--radius)] bg-[var(--caution-soft)] p-3 text-sm text-[var(--caution)]">
          AI 응답이 불안정해 입력하신 정보만으로 조건을 만들었습니다.
        </p>
      ) : null}

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-4">
        {CRITERIA_FIELD_KEYS.map((field: CriteriaFieldKey) => (
          <CriteriaRow
            key={field}
            field={field}
            criteria={data.criteria}
            source={data.sources[field]}
            taxonomy={taxonomy}
            onSave={handleSave}
            isSaving={patchCriteria.isPending}
          />
        ))}
      </div>

      {data.unfilledSlots.length > 0 ? (
        <p className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {data.unfilledSlots
              .map((field) => `'${CRITERIA_FIELD_LABEL[field as CriteriaFieldKey] ?? field}'`)
              .join(", ")}
            는 대화에서 정해지지 않아 기본값을 사용했어요.
          </span>
        </p>
      ) : null}

      {confirmCriteria.isError ? (
        <p role="alert" className="rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]">
          조건을 확정하지 못했어요. 다시 시도해 주세요.
        </p>
      ) : null}

      <div className="flex justify-center pb-4">
        <Button size="lg" onClick={() => confirmCriteria.mutate()} disabled={confirmCriteria.isPending}>
          {confirmCriteria.isPending ? "확정하는 중..." : "이 조건으로 공고 모으기 →"}
        </Button>
      </div>
    </div>
  );
}
