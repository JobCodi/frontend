import { createRequire } from "node:module";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

const { renderToStaticMarkup } = createRequire(import.meta.url)("react-dom/server") as {
  renderToStaticMarkup(node: ReactNode): string;
};
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import { SourceSummaryList } from "./source-summary-list";

const baseSource: SourceSummaryEntry = {
  sourceId: "work24",
  kind: "official-api",
  displayName: "고용24",
  status: "succeeded",
  fetched: 18,
  skipReason: null,
};

describe("SourceSummaryList 검색 조건 표시", () => {
  it("공개된 검색어와 지역을 한국어 레이블 및 값으로 렌더한다", () => {
    const markup = renderToStaticMarkup(
      <SourceSummaryList
        sourceSummary={[
          {
            ...baseSource,
            retrievalProjection: {
              searchTerms: ["프론트엔드", "TypeScript"],
              regions: ["서울", "경기"],
            },
          },
        ]}
      />,
    );

    expect(markup).toContain("검색어");
    expect(markup).toContain("프론트엔드, TypeScript");
    expect(markup).toContain("지역");
    expect(markup).toContain("서울, 경기");
  });

  it("명시적으로 비어 있는 검색 조건은 없음으로 렌더한다", () => {
    const markup = renderToStaticMarkup(
      <SourceSummaryList
        sourceSummary={[
          {
            ...baseSource,
            retrievalProjection: { searchTerms: [], regions: [] },
          },
        ]}
      />,
    );

    expect(markup).toContain("검색어");
    expect(markup).toContain("지역");
    expect(markup.match(/없음/g)).toHaveLength(2);
  });

  it("검색 조건이 생략되면 레이블과 값을 렌더하지 않는다", () => {
    const markup = renderToStaticMarkup(<SourceSummaryList sourceSummary={[baseSource]} />);

    expect(markup).not.toContain("검색어");
    expect(markup).not.toContain("지역");
    expect(markup).not.toContain("프론트엔드");
    expect(markup).not.toContain("서울");
    expect(markup).not.toContain("없음");
  });
});
