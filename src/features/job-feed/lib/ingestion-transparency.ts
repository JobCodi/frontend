import type { RetrievalProjection, SourceSummaryEntry } from "@/lib/schemas/feed";

const STATUS_TEXT: Record<SourceSummaryEntry["status"], string> = {
  succeeded: "수집 완료",
  partial: "일부만 수집",
  failed: "수집 실패",
  skipped: "사용 안 함",
};

function formatFeedDateTime(value: string): string {
  const parts = new Intl.DateTimeFormat("en-CA-u-nu-latn", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Seoul",
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((item) => item.type === type)?.value ?? "";
  const hour = Number(part("hour"));
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;

  return `${part("year")}. ${Number(part("month"))}. ${Number(part("day"))}. ${period} ${displayHour}:${part("minute")}`;
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

export function describeRetrievalProjection(projection: RetrievalProjection): Array<{
  label: "검색어" | "지역";
  value: string;
}> {
  return [
    {
      label: "검색어",
      value: projection.searchTerms.length > 0 ? projection.searchTerms.join(", ") : "없음",
    },
    {
      label: "지역",
      value: projection.regions.length > 0 ? projection.regions.join(", ") : "없음",
    },
  ];
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
