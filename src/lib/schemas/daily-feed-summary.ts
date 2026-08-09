import { z } from "zod";

export const DailyFeedSummarySchema = z.object({
  refreshDate: z.string(),
  generatedAt: z.string(),
  newCount: z.number().nonnegative(),
  closingSoonCount: z.number().nonnegative(),
  removedCount: z.number().nonnegative(),
});
export type DailyFeedSummary = z.infer<typeof DailyFeedSummarySchema>;

export const DailyFeedSummaryResponseSchema = z.object({
  summary: DailyFeedSummarySchema.nullable(),
});
