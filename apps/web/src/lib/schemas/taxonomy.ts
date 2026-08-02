import { z } from "zod";
import { TaxonomyOptionSchema, type TaxonomyOption } from "./common";

export { TaxonomyOptionSchema } from "./common";
export type { TaxonomyOption } from "./common";

/**
 * A job family (e.g. "개발") together with the sub-roles that should be
 * revealed once that family is selected on /start.
 */
export const JobFamilySchema = z.object({
  code: z.string(),
  label: z.string(),
  roles: z.array(TaxonomyOptionSchema),
});
export type JobFamily = z.infer<typeof JobFamilySchema>;

/** `GET /taxonomy` — static server-side, cached for an hour. */
export const TaxonomySchema = z.object({
  jobFamilies: z.array(JobFamilySchema),
  companySizes: z.array(TaxonomyOptionSchema),
  regions: z.array(TaxonomyOptionSchema),
  employmentTypes: z.array(TaxonomyOptionSchema),
  experienceLevels: z.array(TaxonomyOptionSchema),
});
export type Taxonomy = z.infer<typeof TaxonomySchema>;

/** Safe fallback used when GET /taxonomy fails so the /start form can still render. */
export const EMPTY_TAXONOMY: Taxonomy = {
  jobFamilies: [],
  companySizes: [],
  regions: [],
  employmentTypes: [],
  experienceLevels: [],
};

/**
 * `targetStartAt` choices. Unlike every other choice list these are NOT part
 * of `GET /taxonomy` — the backend only validates the enum on POST /sessions
 * — so the labels live here and must track the backend's TARGET_START_AT.
 */
export const TARGET_START_AT_OPTIONS: readonly TaxonomyOption[] = [
  { code: "IMMEDIATE", label: "즉시" },
  { code: "WITHIN_3M", label: "3개월 이내" },
  { code: "WITHIN_6M", label: "6개월 이내" },
  { code: "FLEXIBLE", label: "유동적" },
];
