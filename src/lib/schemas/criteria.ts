import { z } from "zod";

/**
 * The confirmed search criteria — the backend's `criteria.payload`.
 * Values are codes (`DEV`, `BACKEND`, `SEOUL`), not labels; resolve them
 * through the taxonomy before display (src/lib/taxonomy/labels.ts).
 * `salaryMin` is in KRW (원), not 만원.
 */
export const CriteriaPayloadSchema = z.object({
  companySizes: z.array(z.string()),
  jobFamily: z.string(),
  roles: z.array(z.string()),
  experienceLevel: z.string(),
  regions: z.array(z.string()),
  employmentTypes: z.array(z.string()),
  techStack: z.array(z.string()),
  keywords: z.array(z.string()),
  excludeKeywords: z.array(z.string()),
  salaryMin: z.number().nullable(),
  weights: z.object({
    techMatch: z.number(),
    roleMatch: z.number(),
    regionMatch: z.number(),
    freshness: z.number(),
  }),
  selectedCrawlSites: z.array(z.enum(["work24", "saramin", "jobkorea", "jasoseol"])).optional(),
});
export type CriteriaPayload = z.infer<typeof CriteriaPayloadSchema>;
export type CriteriaFieldKey = Exclude<keyof CriteriaPayload, "selectedCrawlSites">;

/** Row order on /criteria. */
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

/**
 * The subset `PATCH /sessions/:id/criteria` accepts. `jobFamily` and
 * `experienceLevel` are NOT in the backend's criteriaPatchSchema — sending
 * them is silently dropped and would burn a criteria version for nothing,
 * so those two rows are read-only in the UI.
 */
export const PATCHABLE_CRITERIA_FIELD_KEYS = [
  "companySizes",
  "roles",
  "regions",
  "employmentTypes",
  "techStack",
  "keywords",
  "excludeKeywords",
  "salaryMin",
  "weights",
] as const satisfies readonly CriteriaFieldKey[];

export type PatchableCriteriaFieldKey = (typeof PATCHABLE_CRITERIA_FIELD_KEYS)[number];

export function isPatchableCriteriaField(
  field: CriteriaFieldKey,
): field is PatchableCriteriaFieldKey {
  return (PATCHABLE_CRITERIA_FIELD_KEYS as readonly CriteriaFieldKey[]).includes(field);
}

export const CriteriaSourceOriginSchema = z.enum([
  "form",
  "turn",
  "default",
  "manual",
]);
export type CriteriaSourceOrigin = z.infer<typeof CriteriaSourceOriginSchema>;

export const CriteriaSourceSchema = z.discriminatedUnion("origin", [
  z.object({ origin: z.literal("form") }),
  z.object({ origin: z.literal("turn"), turnIndex: z.number() }),
  z.object({ origin: z.literal("default") }),
  z.object({ origin: z.literal("manual") }),
]);
export type CriteriaSource = z.infer<typeof CriteriaSourceSchema>;

/** Map of field name -> where its value came from. Partial: an unlisted field has no known origin. */
export const CriteriaSourcesSchema = z.record(z.string(), CriteriaSourceSchema);
export type CriteriaSources = z.infer<typeof CriteriaSourcesSchema>;

/**
 * One stored criteria version. This is the object nested under `criteria`
 * in the `criteria_ready` turns response — it has no `estimatedCount`,
 * which travels as a sibling field there.
 */
export const CriteriaVersionSchema = z.object({
  version: z.number(),
  payload: CriteriaPayloadSchema,
  sources: CriteriaSourcesSchema,
  rationale: z.string().nullable(),
  unfilledSlots: z.array(z.string()),
});
export type CriteriaVersion = z.infer<typeof CriteriaVersionSchema>;

/**
 * `GET /sessions/:id/criteria` and `PATCH /sessions/:id/criteria`: the
 * version object flattened together with the recomputed estimate.
 */
export const CriteriaEnvelopeSchema = CriteriaVersionSchema.extend({
  estimatedCount: z.number(),
});
export type CriteriaEnvelope = z.infer<typeof CriteriaEnvelopeSchema>;

/** `POST /sessions/:id/criteria/confirm` -> 202. */
export const ConfirmCriteriaResponseSchema = z.object({
  status: z.literal("collecting"),
  feedId: z.string(),
  criteriaVersion: z.number(),
});
export type ConfirmCriteriaResponse = z.infer<typeof ConfirmCriteriaResponseSchema>;

/** PATCH body: any subset of the patchable criteria fields. */
export type PatchCriteriaRequest = Partial<Pick<CriteriaPayload, PatchableCriteriaFieldKey>>;

/** `GET /sessions/:id/criteria/history` -> 200. */
export const CriteriaHistoryResponseSchema = z.object({
  versions: z.array(
    z.object({
      version: z.number(),
      createdAt: z.string(),
      estimatedCount: z.number(),
      payload: CriteriaPayloadSchema,
    })
  ),
});
export type CriteriaHistoryResponse = z.infer<typeof CriteriaHistoryResponseSchema>;

/** `POST /sessions/:id/criteria/revert` -> 201. */
export const CriteriaRevertResponseSchema = z.object({
  version: z.number(),
  revertedFrom: z.number(),
  revertedTo: z.number(),
  estimatedCount: z.number(),
  payload: CriteriaPayloadSchema,
});
export type CriteriaRevertResponse = z.infer<typeof CriteriaRevertResponseSchema>;

/**
 * The five conversation slots the backend reports in `unfilledSlots`.
 * These are slot names, not criteria field keys.
 */
export const DISCOVERY_SLOT_LABEL: Record<string, string> = {
  role_detail: "세부 직무",
  skills: "기술·툴",
  company_character: "회사 성향",
  dealbreakers: "피하고 싶은 조건",
  priorities: "우선순위",
};
