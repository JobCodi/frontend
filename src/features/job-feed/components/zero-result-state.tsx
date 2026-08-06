"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CriteriaPayload } from "@/lib/schemas/criteria";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { labelForCode, type TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { useCriteriaSnapshot } from "../hooks/use-criteria-snapshot";
import { SourceSummaryList } from "./source-summary-list";
import { Search } from "lucide-react";

interface ZeroResultStateProps {
  sessionId: string;
  labels: TaxonomyLabelIndex;
  sourceSummary: SourceSummaryEntry[];
}

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
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
        <Search className="h-8 w-8" />
      </div>
      <div>
        <p className="text-xl font-semibold text-gray-900">
          조건에 맞는 공고를 찾지 못했어요.
        </p>
        {hint ? (
          <p className="mt-2 text-sm text-gray-500">
            가장 큰 제약은 &apos;{hint}&apos;로 보입니다.
          </p>
        ) : null}
      </div>
      <SourceSummaryList sourceSummary={sourceSummary} />
      <Button asChild size="lg" className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:from-indigo-600 hover:to-purple-700">
        <Link href={`/discovery/${sessionId}/criteria`}>조건 완화하고 다시 찾기</Link>
      </Button>
    </div>
  );
}
