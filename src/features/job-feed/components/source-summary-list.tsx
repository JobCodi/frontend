import { Check, MinusCircle, TriangleAlert } from "lucide-react";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { cn } from "@/lib/utils/cn";

const STATUS_TEXT: Record<SourceSummaryEntry["status"], string> = {
  succeeded: "수집 완료",
  partial: "일부만 수집",
  failed: "수집 실패",
  skipped: "사용 안 함",
};

function StatusIcon({ status }: { status: SourceSummaryEntry["status"] }) {
  if (status === "succeeded" || status === "partial") {
    return <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--match)]" strokeWidth={2.5} />;
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
      {sourceSummary.map((entry) => (
        <li
          key={entry.sourceId}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-3.5 py-3 shadow-sm",
          )}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface-soft)]">
            <StatusIcon status={entry.status} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[var(--text)]">{entry.displayName}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {entry.status === "succeeded" || entry.status === "partial"
                ? `${entry.fetched.toLocaleString("ko-KR")}건 · ${STATUS_TEXT[entry.status]}`
                : STATUS_TEXT[entry.status]}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
