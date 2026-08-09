import { z } from "zod";
import { isSafeOutboundUrl } from "../utils/outbound-url";
import { MatchReasonSchema } from "./common";

export const FeedSortSchema = z.enum(["score", "recent", "deadline"]);
export type FeedSort = z.infer<typeof FeedSortSchema>;

export const MinScoreSchema = z.union([
  z.literal(0),
  z.literal(60),
  z.literal(80),
]);
export type MinScore = z.infer<typeof MinScoreSchema>;

export const PostingStatusSchema = z.enum(["open", "likely_closed", "closed"]);
export type PostingStatus = z.infer<typeof PostingStatusSchema>;

/**
 * A job posting exactly as the backend returns it. Codes, not labels
 * (`SEOUL`, `FULL_TIME`, `LARGE`); the posting body is never included
 * (Rules.md §2.3). `alsoFoundOn` is a list of source ids, whose display
 * names come from the feed's `sourceSummary` / `GET /ingestion/sources`.
 */
export const JobPostingSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
  companySize: z.string().nullable(),
  companySizeInferred: z.boolean(),
  jobFamily: z.string().nullable(),
  roles: z.array(z.string()),
  regionCode: z.string().nullable(),
  regionDetail: z.string().nullable(),
  employmentType: z.string().nullable(),
  experienceLevels: z.array(z.string()),
  minExperienceYears: z.number().nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  salaryText: z.string().nullable(),
  techStack: z.array(z.string()),
  url: z.string().refine(isSafeOutboundUrl, {
    message: "공고 URL은 절대 HTTP(S) URL이어야 합니다.",
  }),
  postedAt: z.string().nullable(),
  closesAt: z.string().nullable(),
  isRolling: z.boolean(),
  status: PostingStatusSchema,
  sourceId: z.string(),
  alsoFoundOn: z.array(z.string()),
});
export type JobPosting = z.infer<typeof JobPostingSchema>;

/**
 * One scored feed item: server-side `rank`/`score`, the evidence, and the
 * nested posting. `reasons` is intentionally not `.min(1)` here — an empty
 * array is a contract violation the UI must report and skip per card
 * (AGENTS.md #1), not a reason to fail the whole page at the boundary.
 */
export const JobPreferenceSchema = z.enum(["saved", "excluded", "none"]);
export type JobPreference = z.infer<typeof JobPreferenceSchema>;
export const FeedPreferenceSchema = z.enum(["all", "saved"]);
export type FeedPreference = z.infer<typeof FeedPreferenceSchema>;

export const FeedItemSchema = z.object({
  id: z.string(),
  rank: z.number(),
  score: z.number(),
  reasons: z.array(MatchReasonSchema),
  preference: JobPreferenceSchema,
  posting: JobPostingSchema,
});
export type FeedItem = z.infer<typeof FeedItemSchema>;

export const SourceKindSchema = z.enum(["official-api", "ats-api", "html-crawl"]);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const SourceSummaryStatusSchema = z.enum([
  "succeeded",
  "partial",
  "failed",
  "skipped",
]);
export type SourceSummaryStatus = z.infer<typeof SourceSummaryStatusSchema>;

/** Per-source outcome of the collection run that produced this feed. */
export const SourceSummaryEntrySchema = z.object({
  sourceId: z.string(),
  kind: SourceKindSchema,
  displayName: z.string(),
  status: SourceSummaryStatusSchema,
  fetched: z.number(),
  skipReason: z.string().nullable(),
});
export type SourceSummaryEntry = z.infer<typeof SourceSummaryEntrySchema>;

export const FeedCollectionStatusSchema = z.enum(["collecting", "ready", "failed"]);
export type FeedCollectionStatus = z.infer<typeof FeedCollectionStatusSchema>;

/**
 * `GET /sessions/:id/feed` returns three genuinely different bodies
 * discriminated by `status` — while collecting there are no `items` and no
 * `sourceSummary` at all, only a source counter.
 */
export const FeedCollectingPageSchema = z.object({
  status: z.literal("collecting"),
  progress: z.object({
    completedSources: z.number(),
    totalSources: z.number(),
  }),
});
export type FeedCollectingPage = z.infer<typeof FeedCollectingPageSchema>;

export const FeedReadyPageSchema = z.object({
  status: z.literal("ready"),
  feedId: z.string(),
  criteriaVersion: z.number(),
  generatedAt: z.string(),
  totalCount: z.number(),
  sourceSummary: z.array(SourceSummaryEntrySchema),
  items: z.array(FeedItemSchema),
  nextCursor: z.string().nullable(),
  hasMore: z.boolean(),
});
export type FeedReadyPage = z.infer<typeof FeedReadyPageSchema>;

export const FeedFailedPageSchema = z.object({
  status: z.literal("failed"),
  error: z.object({ code: z.string(), message: z.string() }),
  sourceSummary: z.array(SourceSummaryEntrySchema),
  retryable: z.boolean(),
});
export type FeedFailedPage = z.infer<typeof FeedFailedPageSchema>;

export const FeedPageSchema = z.discriminatedUnion("status", [
  FeedCollectingPageSchema,
  FeedReadyPageSchema,
  FeedFailedPageSchema,
]);
export type FeedPage = z.infer<typeof FeedPageSchema>;

/** `POST /sessions/:id/feed/refresh` -> 202. */
export const RefreshFeedResponseSchema = z.object({
  status: z.literal("collecting"),
});
export type RefreshFeedResponse = z.infer<typeof RefreshFeedResponseSchema>;

export interface FeedQueryParams {
  sort: FeedSort;
  minScore: MinScore;
}
