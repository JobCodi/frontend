import { z } from "zod";
import { TaxonomyOptionSchema } from "./common";

export { TaxonomyOptionSchema } from "./common";
export type { TaxonomyOption } from "./common";

/**
 * A job family (e.g. "개발") together with the sub-roles that should be
 * revealed once that family is selected on /start.
 */
export const JobFamilySchema = z.object({
  value: z.string(),
  label: z.string(),
  roles: z.array(TaxonomyOptionSchema),
});
export type JobFamily = z.infer<typeof JobFamilySchema>;

export const TaxonomySchema = z.object({
  companySizes: z.array(TaxonomyOptionSchema),
  jobFamilies: z.array(JobFamilySchema),
  experienceLevels: z.array(TaxonomyOptionSchema),
  regions: z.array(TaxonomyOptionSchema),
  employmentTypes: z.array(TaxonomyOptionSchema),
  startTimings: z.array(TaxonomyOptionSchema).optional().default([]),
});
export type Taxonomy = z.infer<typeof TaxonomySchema>;

/** Safe fallback used when GET /taxonomy fails so the /start form can still render. */
export const EMPTY_TAXONOMY: Taxonomy = {
  companySizes: [],
  jobFamilies: [],
  experienceLevels: [],
  regions: [],
  employmentTypes: [],
  startTimings: [],
};
