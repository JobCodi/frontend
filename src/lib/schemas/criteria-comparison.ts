import { z } from "zod";
import { CriteriaPayloadSchema } from "./criteria";

const CriteriaComparisonVersionSchema = z.object({
  version: z.number(),
  estimatedCount: z.number().nonnegative(),
  payload: CriteriaPayloadSchema,
});

export const CriteriaComparisonResponseSchema = z.object({
  comparison: z.object({
    current: CriteriaComparisonVersionSchema,
    previous: CriteriaComparisonVersionSchema.nullable(),
  }).nullable(),
});
export type CriteriaComparisonResponse = z.infer<typeof CriteriaComparisonResponseSchema>;
