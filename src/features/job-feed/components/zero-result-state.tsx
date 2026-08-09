"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CriteriaPayload } from "@/lib/schemas/criteria";
import type { FeedPreference, SourceSummaryEntry } from "@/lib/schemas/feed";
import { labelForCode, type TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { useCriteriaSnapshot } from "../hooks/use-criteria-snapshot";
import { SourceSummaryList } from "./source-summary-list";

interface ZeroResultStateProps {
  sessionId: string;
  labels: TaxonomyLabelIndex;
  sourceSummary: SourceSummaryEntry[];
  preference: FeedPreference;
  onShowAll: () => void;
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

export function ZeroResultState({ sessionId, labels, sourceSummary, preference, onShowAll }: ZeroResultStateProps) {
  const { data } = useCriteriaSnapshot(sessionId, preference === "all");
  const hint = data ? biggestConstraintHint(data.payload, labels) : null;
  const savedOnly = preference === "saved";

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-[var(--line)] bg-white px-8 py-14 text-center shadow-[var(--shadow-card)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--surface-soft)] to-white text-[var(--text-subtle)] ring-1 ring-[var(--line)]">
        <Search className="h-8 w-8" />
      </div>
      <div>
        <p className="text-xl font-semibold tracking-tight text-[var(--text)]">
          {savedOnly ? "아직 관심 공고가 없어요." : "조건에 맞는 공고를 찾지 못했어요."}
        </p>
        {savedOnly ? (
          <p className="mt-2 text-sm text-[var(--text-muted)]">마음에 드는 공고의 북마크를 눌러 나중에 다시 확인하세요.</p>
        ) : hint ? (
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            가장 큰 제약은 &apos;{hint}&apos;로 보입니다.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            조건을 조금 완화하면 더 많은 공고를 볼 수 있어요.
          </p>
        )}
      </div>
      <div className="w-full max-w-xl">
        <SourceSummaryList sourceSummary={sourceSummary} />
      </div>
      {savedOnly ? (
        <Button
          size="lg"
          onClick={onShowAll}
          className="rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
        >
          전체 공고 보기
        </Button>
      ) : (
        <Button
          asChild
          size="lg"
          className="rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
        >
          <Link href={`/discovery/${sessionId}/criteria`}>조건 완화하고 다시 찾기</Link>
        </Button>
      )}
    </div>
  );
}
