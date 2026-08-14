import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { FeedFailedPageSchema, SourceSummaryEntrySchema } from "@/lib/schemas/feed";
import {
  describeRetrievalProjection,
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

const transparencyCardSource = readFileSync(
  new URL("../components/ingestion-transparency-card.tsx", import.meta.url),
  "utf8",
);
const sourceSummaryListSource = readFileSync(
  new URL("../components/source-summary-list.tsx", import.meta.url),
  "utf8",
);

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

  it("런타임 ICU 표기와 관계없이 한국어 오후 시각을 만든다", () => {
    expect(getIngestionSummary("2026-08-10T03:05:00.000Z", 1).updatedAt).toBe(
      "2026. 8. 10. 오후 12:05",
    );
  });

  it("출처 요약이 비어 있어도 수집 정보 부재를 명시한다", () => {
    expect(transparencyCardSource).not.toContain("if (sourceSummary.length === 0) return null");
    expect(transparencyCardSource).toContain("수집 출처 정보가 없어요");
  });

  it("API가 공개한 소스별 검색어와 지역만 표시용으로 만든다", () => {
    const entry = SourceSummaryEntrySchema.parse({
      ...sourceSummary[0],
      retrievalProjection: {
        searchTerms: ["프론트엔드", "TypeScript"],
        regions: ["서울", "경기"],
      },
    });

    expect(entry.retrievalProjection).toEqual({
      searchTerms: ["프론트엔드", "TypeScript"],
      regions: ["서울", "경기"],
    });
    if (!entry.retrievalProjection) throw new Error("retrievalProjection이 필요합니다.");

    expect(describeRetrievalProjection(entry.retrievalProjection)).toEqual([
      { label: "검색어", value: "프론트엔드, TypeScript" },
      { label: "지역", value: "서울, 경기" },
    ]);
  });

  it("retrievalProjection이 없는 소스에는 검색 조건을 추정하지 않는다", () => {
    const entry = SourceSummaryEntrySchema.parse(sourceSummary[1]);

    expect(entry.retrievalProjection).toBeUndefined();
    expect(sourceSummaryListSource).toContain("entry.retrievalProjection ?");
  });

  it("API가 빈 검색어와 지역을 명시하면 빈 값 그대로 안내한다", () => {
    const entry = SourceSummaryEntrySchema.parse({
      ...sourceSummary[0],
      retrievalProjection: { searchTerms: [], regions: [] },
    });

    expect(entry.retrievalProjection).toBeDefined();
    if (!entry.retrievalProjection) throw new Error("retrievalProjection이 필요합니다.");

    expect(describeRetrievalProjection(entry.retrievalProjection)).toEqual([
      { label: "검색어", value: "없음" },
      { label: "지역", value: "없음" },
    ]);
  });
});
