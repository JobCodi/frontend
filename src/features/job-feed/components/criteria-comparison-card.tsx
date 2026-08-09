import { ArrowRight, SlidersHorizontal } from "lucide-react";
import type { CriteriaComparisonResponse } from "@/lib/schemas/criteria-comparison";
import type { TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { labelsForCodes } from "@/lib/taxonomy/labels";
import { describeCriteriaChanges } from "../lib/criteria-comparison";

interface CriteriaComparisonCardProps {
  comparison: NonNullable<CriteriaComparisonResponse["comparison"]>;
  labels: TaxonomyLabelIndex;
}

function withLabels(payload: CriteriaComparisonCardProps["comparison"]["current"]["payload"], labels: TaxonomyLabelIndex) {
  return {
    ...payload,
    roles: labelsForCodes(labels, "role", payload.roles),
    regions: labelsForCodes(labels, "region", payload.regions),
    employmentTypes: labelsForCodes(labels, "employmentType", payload.employmentTypes),
  };
}

export function CriteriaComparisonCard({ comparison, labels }: CriteriaComparisonCardProps) {
  if (comparison.previous === null) return null;
  const current = withLabels(comparison.current.payload, labels);
  const previous = withLabels(comparison.previous.payload, labels);
  const changes = describeCriteriaChanges(current, previous);
  const delta = comparison.current.estimatedCount - comparison.previous.estimatedCount;

  return (
    <section aria-labelledby="criteria-comparison-title" className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 id="criteria-comparison-title" className="text-sm font-semibold text-[var(--text)]">조건 변경 비교</h2>
            <p className="mt-0.5 text-xs text-[var(--text-subtle)]">현재 조건 v{comparison.current.version}과 직전 v{comparison.previous.version}의 서버 기준 결과입니다.</p>
          </div>
        </div>
        <strong className="text-sm text-[var(--text)]">{comparison.current.estimatedCount}건</strong>
      </div>
      <p className="mt-3 rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--text-muted)]">
        직전 조건 {comparison.previous.estimatedCount}건 대비 <strong className="text-[var(--text)]">{delta >= 0 ? `+${delta}` : delta}건</strong>
      </p>
      {changes.length > 0 ? <ul className="mt-3 space-y-2">{changes.map((change) => <li key={change.label} className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]"><strong className="text-[var(--text)]">{change.label}</strong><span>{change.before}</span><ArrowRight className="h-3 w-3" aria-hidden="true" /><span>{change.after}</span></li>)}</ul> : <p className="mt-3 text-xs text-[var(--text-subtle)]">핵심 조건 변화는 없고, 가중치 또는 세부 설정이 조정되었습니다.</p>}
    </section>
  );
}
