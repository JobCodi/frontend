import type { SourceSummaryEntry } from "@/lib/schemas/feed";

const STATUS_TEXT: Record<SourceSummaryEntry["status"], string> = {
  succeeded: "수집 완료",
  partial: "일부만 수집",
  failed: "수집 실패",
  skipped: "사용 안 함",
};

function formatFeedDateTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function describeSourceSummaryEntry(entry: SourceSummaryEntry): {
  outcome: string;
  attemptedAt: string | null;
} {
  const status = STATUS_TEXT[entry.status];
  const outcome =
    entry.status === "succeeded" || entry.status === "partial"
      ? `${entry.fetched.toLocaleString("ko-KR")}건 · ${status}`
      : status;

  return {
    outcome: entry.skipReason ? `${outcome} · ${entry.skipReason}` : outcome,
    attemptedAt: entry.attemptedAt ? `확인 ${formatFeedDateTime(entry.attemptedAt)}` : null,
  };
}

export function getIngestionSummary(generatedAt: string, sourceCount: number): {
  updatedAt: string;
  sourceCount: string;
} {
  return {
    updatedAt: formatFeedDateTime(generatedAt),
    sourceCount: `${sourceCount.toLocaleString("ko-KR")}개 출처 확인`,
  };
}
