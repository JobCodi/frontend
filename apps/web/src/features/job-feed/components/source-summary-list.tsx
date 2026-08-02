import { Check, MinusCircle, TriangleAlert } from "lucide-react";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";

const STATUS_TEXT: Record<SourceSummaryEntry["status"], string> = {
  succeeded: "수집 완료",
  partial: "일부만 수집",
  failed: "수집 실패",
  skipped: "사용 안 함",
};

function StatusIcon({ status }: { status: SourceSummaryEntry["status"] }) {
  if (status === "succeeded" || status === "partial") {
    return <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--match)]" />;
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
    <ul className="flex flex-col gap-1.5 text-left">
      {sourceSummary.map((entry) => (
        <li key={entry.sourceId} className="flex items-start gap-2 text-sm">
          <StatusIcon status={entry.status} />
          <span className="text-[var(--text)]">{entry.displayName}</span>
          <span className="text-[var(--text-muted)]">
            {entry.status === "succeeded" || entry.status === "partial"
              ? `${entry.fetched.toLocaleString("ko-KR")}건`
              : STATUS_TEXT[entry.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
