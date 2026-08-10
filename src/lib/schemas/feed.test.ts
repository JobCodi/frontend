import { describe, expect, it, vi } from "vitest";
import { filterRenderableFeedItems } from "@/features/job-feed/lib/filter-renderable-feed-items";
import { FeedItemSchema, FeedReadyPageSchema } from "./feed";

const validFeedItem = {
  id: "feed-item-1",
  rank: 1,
  score: 91,
  scoreBreakdown: {
    techMatch: 40,
    roleMatch: 30,
    regionMatch: 15,
    freshness: 6,
    penalty: 0,
  },
  reasons: [{ kind: "match", field: "roles", text: "희망 직무와 일치합니다" }],
  preference: "none",
  posting: {
    id: "posting-1",
    title: "프론트엔드 개발자",
    companyName: "JobCodi",
    companySize: "STARTUP",
    companySizeInferred: false,
    jobFamily: "DEVELOPMENT",
    roles: ["FRONTEND"],
    regionCode: "SEOUL",
    regionDetail: null,
    employmentType: "FULL_TIME",
    experienceLevels: ["ENTRY"],
    minExperienceYears: null,
    salaryMin: null,
    salaryMax: null,
    salaryText: null,
    techStack: ["TypeScript"],
    url: "https://jobs.example/posting-1",
    postedAt: null,
    closesAt: null,
    isRolling: true,
    status: "open",
    sourceId: "official",
    alsoFoundOn: [],
  },
};

describe("Feed API 계약 경계", () => {
  it("ready 응답에서 빈 매칭 근거 항목만 제외하고 유효한 항목은 유지한다", () => {
    const contractError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const page = FeedReadyPageSchema.parse({
      status: "ready",
      feedId: "feed-1",
      criteriaVersion: 1,
      generatedAt: "2026-08-11T00:00:00.000Z",
      totalCount: 2,
      sourceSummary: [],
      items: [
        validFeedItem,
        { ...validFeedItem, id: "feed-item-without-reasons", reasons: [] },
      ],
      nextCursor: null,
      hasMore: false,
    });

    expect(filterRenderableFeedItems(page.items)).toEqual([validFeedItem]);
    expect(contractError).toHaveBeenCalledWith(
      "[job-feed] Feed item has empty reasons; skipping render.",
    );
    contractError.mockRestore();
  });

  it.each(["javascript:alert(1)", "data:text/html,unsafe", "/relative-job"])(
    "HTTP(S)가 아닌 공고 URL %s를 거부한다",
    (url) => {
      expect(
        FeedItemSchema.safeParse({
          ...validFeedItem,
          posting: { ...validFeedItem.posting, url },
        }).success,
      ).toBe(false);
    },
  );

  it.each(["https://jobs.example/posting-1", "http://jobs.example/posting-1"])(
    "안전한 절대 URL %s는 허용한다",
    (url) => {
      expect(
        FeedItemSchema.safeParse({
          ...validFeedItem,
          posting: { ...validFeedItem.posting, url },
        }).success,
      ).toBe(true);
    },
  );
});
