import { z } from "zod";

/**
 * The confirmed search criteria. Field names mirror screens.md's /criteria
 * spec exactly — keep this list and CriteriaFieldKeySchema in sync.
 */
export const CriteriaFieldsSchema = z.object({
  companySizes: z.array(z.string()).default([]),
  jobFamily: z.string().nullable().default(null),
  roles: z.array(z.string()).default([]),
  experienceLevel: z.string().nullable().default(null),
  regions: z.array(z.string()).default([]),
  employmentTypes: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  excludeKeywords: z.array(z.string()).default([]),
  salaryMin: z.number().nullable().default(null),
  weights: z.object({
    techStack: z.number(),
    role: z.number(),
    region: z.number(),
    recency: z.number(),
  }),
});
export type CriteriaFields = z.infer<typeof CriteriaFieldsSchema>;
export type CriteriaFieldKey = keyof CriteriaFields;

/** Every editable field on /criteria, used to drive the field -> editor-type map. */
export const CRITERIA_FIELD_KEYS = [
  "companySizes",
  "jobFamily",
  "roles",
  "experienceLevel",
  "regions",
  "employmentTypes",
  "techStack",
  "keywords",
  "excludeKeywords",
  "salaryMin",
  "weights",
] as const satisfies readonly CriteriaFieldKey[];

export const CriteriaSourceOriginSchema = z.enum([
  "form",
  "turn",
  "default",
  "manual",
]);
export type CriteriaSourceOrigin = z.infer<typeof CriteriaSourceOriginSchema>;

export const CriteriaSourceSchema = z.object({
  origin: CriteriaSourceOriginSchema,
  turnIndex: z.number().optional(),
});
export type CriteriaSource = z.infer<typeof CriteriaSourceSchema>;

/** Map of field name -> where its value came from. Partial: an unlisted field has no known origin. */
export const CriteriaSourcesSchema = z.record(z.string(), CriteriaSourceSchema);
export type CriteriaSources = z.infer<typeof CriteriaSourcesSchema>;

/**
 * GET /sessions/:id/criteria and PATCH /sessions/:id/criteria both return
 * this envelope. Also embedded in the turns response once status flips to
 * "criteria_ready".
 */
export const CriteriaEnvelopeSchema = z.object({
  criteria: CriteriaFieldsSchema,
  sources: CriteriaSourcesSchema,
  estimatedCount: z.number(),
  unfilledSlots: z.array(z.string()).optional().default([]),
  version: z.number().optional().default(1),
});
export type CriteriaEnvelope = z.infer<typeof CriteriaEnvelopeSchema>;

export const ConfirmCriteriaResponseSchema = z.object({
  feedId: z.string(),
});
export type ConfirmCriteriaResponse = z.infer<typeof ConfirmCriteriaResponseSchema>;

/** PATCH body: any subset of criteria fields. */
export type PatchCriteriaRequest = Partial<CriteriaFields>;
