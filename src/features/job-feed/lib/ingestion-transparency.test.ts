import { describe, expect, it } from "vitest";
import { FeedFailedPageSchema, SourceSummaryEntrySchema } from "@/lib/schemas/feed";
import {
  describeSourceSummaryEntry,
  getIngestionSummary,
} from "./ingestion-transparency";

const sourceSummary = [
  {
    sourceId: "work24",
    kind: "official-api" as const,
    displayName: "고용24",
    status: "succeeded" as const,
    fetched: 18,
    skipReason: null,
    attemptedAt: "2026-08-10T01:20:00.000Z",
  },
  {
    sourceId: "legacy-crawler",
    kind: "html-crawl" as const,
    displayName: "HTML 크롤러",
    status: "skipped" as const,
    fetched: 0,
    skipReason: "관리자 설정으로 비활성화",
  },
];

describe("Feed 수집 투명성", () => {
  it("attemptedAt이 있거나 없는 source entry를 모두 허용하고 failed generatedAt을 보존한다", () => {
    expect(SourceSummaryEntrySchema.parse(sourceSummary[0]).attemptedAt).toBe(
      "2026-08-10T01:20:00.000Z",
    );
    expect(SourceSummaryEntrySchema.parse(sourceSummary[1]).attemptedAt).toBeUndefined();

    const failed = FeedFailedPageSchema.parse({
      status: "failed",
      generatedAt: "2026-08-10T01:21:00.000Z",
      error: { code: "COLLECTION_FAILED", message: "수집에 실패했습니다." },
      sourceSummary,
      retryable: true,
    });
    expect(failed.generatedAt).toBe("2026-08-10T01:21:00.000Z");
  });

  it("출처별 상태, 성공 건수, 확인 시각과 건너뜀 사유를 텍스트로 만든다", () => {
    expect(describeSourceSummaryEntry(sourceSummary[0])).toEqual({
      outcome: "18건 · 수집 완료",
      attemptedAt: "확인 2026. 8. 10. 오전 10:20",
    });
    expect(describeSourceSummaryEntry(sourceSummary[1])).toEqual({
      outcome: "사용 안 함 · 관리자 설정으로 비활성화",
      attemptedAt: null,
    });
  });

  it("Feed 갱신 시각과 확인한 출처 수를 요약한다", () => {
    expect(getIngestionSummary("2026-08-10T01:21:00.000Z", sourceSummary.length)).toEqual({
      updatedAt: "2026. 8. 10. 오전 10:21",
      sourceCount: "2개 출처 확인",
    });
  });
});
