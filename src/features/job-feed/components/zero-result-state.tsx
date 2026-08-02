"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CriteriaPayload } from "@/lib/schemas/criteria";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { labelForCode, type TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { useCriteriaSnapshot } from "../hooks/use-criteria-snapshot";
import { SourceSummaryList } from "./source-summary-list";

interface ZeroResultStateProps {
  sessionId: string;
  labels: TaxonomyLabelIndex;
  sourceSummary: SourceSummaryEntry[];
}

/**
 * screens.md /feed "결과 0건": the backend doesn't tell us which condition
 * caused the empty result, so we guess with a fixed-priority heuristic —
 * excludeKeywords > a single region > techStack over 5 items.
 */
function biggestConstraintHint(
  criteria: CriteriaPayload,
  labels: TaxonomyLabelIndex,
): string | null {
  if (criteria.excludeKeywords.length > 0) {
    return `제외 조건 ${criteria.excludeKeywords.length}개`;
  }
  const [onlyRegion] = criteria.regions;
  if (criteria.regions.length === 1 && onlyRegion !== undefined) {
    return `희망 지역 '${labelForCode(labels, "region", onlyRegion) ?? onlyRegion}' 1개`;
  }
  if (criteria.techStack.length > 5) {
    return `기술 스택 ${criteria.techStack.length}개`;
  }
  return null;
}

export function ZeroResultState({ sessionId, labels, sourceSummary }: ZeroResultStateProps) {
  const { data } = useCriteriaSnapshot(sessionId, true);
  const hint = data ? biggestConstraintHint(data.payload, labels) : null;

  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
      <p className="text-[15px] font-medium text-[var(--text)]">
        조건에 맞는 공고를 찾지 못했어요.
      </p>
      {hint ? (
        <p className="text-sm text-[var(--text-muted)]">가장 큰 제약은 &apos;{hint}&apos;로 보입니다.</p>
      ) : null}
      <SourceSummaryList sourceSummary={sourceSummary} />
      <Button asChild>
        <Link href={`/discovery/${sessionId}/criteria`}>조건 완화하고 다시 찾기</Link>
      </Button>
    </div>
  );
}
