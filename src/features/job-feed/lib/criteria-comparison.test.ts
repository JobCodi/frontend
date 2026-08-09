import { describe, expect, it } from "vitest";
import { describeCriteriaChanges } from "./criteria-comparison";

describe("describeCriteriaChanges", () => {
  it("reports only changed decision fields between two server criteria versions", () => {
    expect(describeCriteriaChanges(
      { roles: ["BACKEND"], regions: ["SEOUL"], employmentTypes: ["FULL_TIME"], techStack: ["React", "Node.js"], excludeKeywords: ["계약직"] },
      { roles: ["FRONTEND"], regions: ["SEOUL"], employmentTypes: ["FULL_TIME"], techStack: ["React"], excludeKeywords: [] },
    )).toEqual([
      { label: "희망 직무", before: "FRONTEND", after: "BACKEND" },
      { label: "기술 스택", before: "React", after: "React · Node.js" },
      { label: "제외 조건", before: "없음", after: "계약직" },
    ]);
  });
});
