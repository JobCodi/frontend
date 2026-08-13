import { describe, expect, it } from "vitest";
import { EMPTY_GOAL_INPUT, isGoalInputSubmittable } from "./types";

describe("goal intake filterable fields", () => {
  it("keeps only criteria that are currently applied by the crawling or matching path", () => {
    expect(EMPTY_GOAL_INPUT).toEqual({
      companySizes: [],
      jobFamily: "",
      roles: [],
      experienceLevel: "",
      regions: [],
      employmentTypes: [],
      selectedCrawlSites: [],
    });
  });

  it("preserves the existing required inputs for a crawl session", () => {
    expect(
      isGoalInputSubmittable({
        ...EMPTY_GOAL_INPUT,
        companySizes: ["STARTUP"],
        jobFamily: "DEVELOPMENT",
        experienceLevel: "YEAR_2",
        selectedCrawlSites: ["work24"],
      }),
    ).toBe(true);
  });
});
