import type { CriteriaFieldKey, CriteriaFields } from "@/lib/schemas/criteria";
import type { Taxonomy, TaxonomyOption } from "@/lib/schemas/taxonomy";

/** Resolves the taxonomy option list a given editable field should offer. */
export function optionsForField(
  field: CriteriaFieldKey,
  taxonomy: Taxonomy,
  criteria: CriteriaFields,
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
      return taxonomy.jobFamilies.map((f) => ({ value: f.value, label: f.label }));
    case "roles": {
      const family = taxonomy.jobFamilies.find((f) => f.value === criteria.jobFamily);
      return family?.roles ?? [];
    }
    default:
      return [];
  }
}
