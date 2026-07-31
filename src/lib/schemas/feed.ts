import { z } from "zod";
import { MatchReasonSchema } from "./common";

export const FeedSortSchema = z.enum(["score", "recent", "deadline"]);
export type FeedSort = z.infer<typeof FeedSortSchema>;

export const MinScoreSchema = z.union([
  z.literal(0),
  z.literal(60),
  z.literal(80),
]);
export type MinScore = z.infer<typeof MinScoreSchema>;

/**
 * A single found-on reference: e.g. the same posting also appears on 고용24.
 */
export const AlsoFoundOnSchema = z.object({
  source: z.string(),
  label: z.string(),
  url: z.string().optional(),
});

export const FeedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companySize: z.string().nullable().default(null),
  companySizeInferred: z.boolean().optional().default(false),
  employmentType: z.string().nullable().default(null),
  experienceLevel: z.string().nullable().default(null),
  region: z.string().nullable().default(null),
  techStack: z.array(z.string()).default([]),
  salaryText: z.string().nullable().default(null),
  score: z.number(),
  /**
   * Never render a card whose `reasons` is empty — that's a contract
   * violation, not a valid empty state (see AGENTS.md #1 / Rules.md §2.1).
   */
  reasons: z.array(MatchReasonSchema),
  source: z.string(),
  sourceLabel: z.string(),
  url: z.string(),
  alsoFoundOn: z.array(AlsoFoundOnSchema).optional().default([]),
  postedAt: z.string().nullable().default(null),
  closesAt: z.string().nullable().default(null),
  isRolling: z.boolean().optional().default(false),
});
export type FeedItem = z.infer<typeof FeedItemSchema>;

export const SourceProgressStatusSchema = z.enum([
  "done",
  "in_progress",
  "unused",
]);
export type SourceProgressStatus = z.infer<typeof SourceProgressStatusSchema>;

export const SourceProgressSchema = z.object({
  source: z.string(),
  label: z.string(),
  status: SourceProgressStatusSchema,
  count: z.number().optional(),
});
export type SourceProgress = z.infer<typeof SourceProgressSchema>;

export const FeedCollectionStatusSchema = z.enum([
  "collecting",
  "ready",
  "collection_failed",
]);
export type FeedCollectionStatus = z.infer<typeof FeedCollectionStatusSchema>;

export const FeedPageSchema = z.object({
  status: FeedCollectionStatusSchema,
  items: z.array(FeedItemSchema),
  nextCursor: z.string().nullable().default(null),
  hasMore: z.boolean().default(false),
  total: z.number().optional(),
  sourceProgress: z.array(SourceProgressSchema).optional().default([]),
  retryable: z.boolean().optional().default(true),
  message: z.string().nullable().optional(),
});
export type FeedPage = z.infer<typeof FeedPageSchema>;

export const RefreshFeedResponseSchema = z.object({
  accepted: z.boolean().optional().default(true),
});
export type RefreshFeedResponse = z.infer<typeof RefreshFeedResponseSchema>;

export interface FeedQueryParams {
  sort: FeedSort;
  minScore: MinScore;
}
