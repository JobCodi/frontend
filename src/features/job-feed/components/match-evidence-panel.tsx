import { AlertTriangle, Check, MinusCircle } from "lucide-react";
import type { JobView } from "../lib/to-job-view";
import { buildMatchEvidence, type MatchEvidenceGroup } from "../lib/match-evidence";

interface MatchEvidencePanelProps {
  job: JobView;
}

function GroupIcon({ kind }: { kind: MatchEvidenceGroup["kind"] }) {
  switch (kind) {
    case "match":
      return <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />;
    case "caution":
      return <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />;
    case "gap":
      return <MinusCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />;
  }
}

export function MatchEvidencePanel({ job }: MatchEvidencePanelProps) {
  const evidence = buildMatchEvidence({ breakdown: job.scoreBreakdown, reasons: job.reasons });

  return (
    <section
      aria-labelledby="job-detail-evidence"
      className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 id="job-detail-evidence" className="text-sm font-semibold text-[var(--text)]">
            매칭 해석
          </h3>
          <p className="mt-1 text-xs leading-5 text-[var(--text-subtle)]">
            점수는 설정한 조건과 공고 메타데이터의 서버 계산 결과입니다.
          </p>
        </div>
        <strong className="text-2xl font-semibold tracking-tight text-[var(--text)]">{job.score}점</strong>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {evidence.contributions.map((contribution) => (
          <div key={contribution.label} className="rounded-xl bg-[var(--surface-soft)] px-3 py-2.5 ring-1 ring-[var(--line)]">
            <dt className="text-[11px] font-medium text-[var(--text-subtle)]">{contribution.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--text)]">{contribution.value}{contribution.label === "감점" ? "점" : "%"}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-3">
        {evidence.groups.map((group) => (
          <section key={group.kind} aria-label={group.title} className="rounded-2xl border border-[var(--line)] p-3.5">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <GroupIcon kind={group.kind} />
              {group.title}
            </h4>
            <ul className="mt-2 space-y-1.5">
              {group.reasons.map((reason, index) => (
                <li key={`${reason.field ?? "reason"}-${index}`} className="text-sm leading-5 text-[var(--text-muted)]">
                  {reason.text}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
