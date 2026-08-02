import type { CriteriaFieldKey, CriteriaPayload } from "@/lib/schemas/criteria";
import type { Taxonomy, TaxonomyOption } from "@/lib/schemas/taxonomy";

/** Resolves the taxonomy option list a given field should offer / label against. */
export function optionsForField(
  field: CriteriaFieldKey,
  taxonomy: Taxonomy,
  criteria: CriteriaPayload,
): TaxonomyOption[] {
  switch (field) {
    case "companySizes":
      return taxonomy.companySizes;
    case "regions":
      return taxonomy.regions;
    case "employmentTypes":
      return taxonomy.employmentTypes;
    case "experienceLevel":
      return taxonomy.experienceLevels;
    case "jobFamily":
      return taxonomy.jobFamilies.map((f) => ({ code: f.code, label: f.label }));
    case "roles": {
      const family = taxonomy.jobFamilies.find((f) => f.code === criteria.jobFamily);
      return family?.roles ?? [];
    }
    default:
      return [];
  }
}
