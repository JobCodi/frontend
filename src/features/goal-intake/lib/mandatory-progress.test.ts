import { describe, expect, it } from "vitest";
import { getMandatoryProgress } from "./mandatory-progress";

describe("getMandatoryProgress", () => {
  it("필수 항목 4개를 하나의 기준으로 계산한다", () => {
    expect(
      getMandatoryProgress({
        companySizes: ["startup"],
        jobFamily: "development",
        experienceLevel: "entry",
        selectedCrawlSites: ["wanted"],
      }),
    ).toEqual({ completed: 4, total: 4, percent: 100 });
  });

  it("진행률을 0~100으로 제한한다", () => {
    expect(
      getMandatoryProgress({
        companySizes: [],
        jobFamily: "",
        experienceLevel: "",
        selectedCrawlSites: [],
      }).percent,
    ).toBe(0);
  });
});
