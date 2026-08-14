import { Check, CircleAlert, MinusCircle, TriangleAlert } from "lucide-react";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { describeRetrievalProjection, describeSourceSummaryEntry } from "../lib/ingestion-transparency";

function StatusIcon({ status }: { status: SourceSummaryEntry["status"] }) {
  if (status === "succeeded") {
    return <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--match)]" strokeWidth={2.5} />;
  }
  if (status === "partial") {
    return <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--caution)]" />;
  }
  if (status === "failed") {
    return <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--danger)]" />;
  }
  return <MinusCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--text-subtle)]" />;
}

interface SourceSummaryListProps {
  sourceSummary: SourceSummaryEntry[];
}

/** Per-source outcome of the finished run. Status is icon + text, never color alone. */
export function SourceSummaryList({ sourceSummary }: SourceSummaryListProps) {
  if (sourceSummary.length === 0) return null;

  return (
    <ul className="grid w-full gap-2 text-left sm:grid-cols-2">
      {sourceSummary.map((entry) => {
        const description = describeSourceSummaryEntry(entry);
        return (
          <li
            key={entry.sourceId}
            className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-3.5 py-3 shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface-soft)]">
              <StatusIcon status={entry.status} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text)]">{entry.displayName}</p>
              <p className="text-xs text-[var(--text-muted)]">{description.outcome}</p>
              {description.attemptedAt ? (
                <p className="mt-0.5 text-[11px] text-[var(--text-subtle)]">{description.attemptedAt}</p>
              ) : null}
              {entry.retrievalProjection ? (
                <dl className="mt-2 grid gap-1 border-t border-[var(--line)] pt-2 text-xs text-[var(--text-muted)]">
                  {describeRetrievalProjection(entry.retrievalProjection).map((item) => (
                    <div key={item.label} className="flex gap-1.5">
                      <dt className="shrink-0 font-medium text-[var(--text)]">{item.label}</dt>
                      <dd className="min-w-0 break-words">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
