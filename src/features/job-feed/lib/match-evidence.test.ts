import { describe, expect, it } from "vitest";
import { buildMatchEvidence } from "./match-evidence";

describe("buildMatchEvidence", () => {
  it("keeps server contribution values and groups every reason by its kind", () => {
    const result = buildMatchEvidence({
      breakdown: { techMatch: 80, roleMatch: 100, regionMatch: 60, freshness: 90, penalty: 25 },
      reasons: [
        { kind: "match", field: "roles", text: "희망 직무와 정확히 일치합니다" },
        { kind: "caution", field: "regions", text: "희망 지역과 인접한 광역권입니다" },
        { kind: "gap", field: "experienceLevel", text: "희망 경력 조건과 일치하지 않습니다" },
      ],
    });

    expect(result.contributions).toEqual([
      { label: "직무", value: 100 },
      { label: "기술", value: 80 },
      { label: "지역", value: 60 },
      { label: "최신성", value: 90 },
      { label: "감점", value: 25 },
    ]);
    expect(result.groups).toEqual([
      { kind: "match", title: "맞는 점", reasons: [{ kind: "match", field: "roles", text: "희망 직무와 정확히 일치합니다" }] },
      { kind: "caution", title: "확인할 점", reasons: [{ kind: "caution", field: "regions", text: "희망 지역과 인접한 광역권입니다" }] },
      { kind: "gap", title: "조건 차이", reasons: [{ kind: "gap", field: "experienceLevel", text: "희망 경력 조건과 일치하지 않습니다" }] },
    ]);
  });

  it("omits empty reason groups", () => {
    const result = buildMatchEvidence({
      breakdown: { techMatch: 0, roleMatch: 100, regionMatch: 0, freshness: 100, penalty: 0 },
      reasons: [{ kind: "match", text: "희망 직무와 정확히 일치합니다" }],
    });

    expect(result.groups).toEqual([{ kind: "match", title: "맞는 점", reasons: [{ kind: "match", text: "희망 직무와 정확히 일치합니다" }] }]);
  });
});
