import type { Taxonomy } from "@/lib/schemas/taxonomy";

/**
 * Code -> Korean label lookup, built from `GET /taxonomy`.
 *
 * The backend speaks codes everywhere (`SEOUL`, `FULL_TIME`, `LARGE`,
 * `ENTRY`, `DEV`, `BACKEND`) and `/taxonomy` is the only place those map to
 * Korean. Plain objects (not Map) so the index can cross the Server ->
 * Client component boundary.
 */
export type TaxonomyCodeKind =
  | "jobFamily"
  | "role"
  | "companySize"
  | "region"
  | "employmentType"
  | "experienceLevel";

export type TaxonomyLabelIndex = Readonly<
  Record<TaxonomyCodeKind, Readonly<Record<string, string>>>
>;

function toRecord(options: readonly { code: string; label: string }[]): Record<string, string> {
  return Object.fromEntries(options.map((option) => [option.code, option.label]));
}

export function buildTaxonomyLabelIndex(taxonomy: Taxonomy): TaxonomyLabelIndex {
  return {
    jobFamily: toRecord(taxonomy.jobFamilies.map((f) => ({ code: f.code, label: f.label }))),
    role: toRecord(taxonomy.jobFamilies.flatMap((f) => f.roles)),
    companySize: toRecord(taxonomy.companySizes),
    region: toRecord(taxonomy.regions),
    employmentType: toRecord(taxonomy.employmentTypes),
    experienceLevel: toRecord(taxonomy.experienceLevels),
  };
}

export const EMPTY_TAXONOMY_LABEL_INDEX: TaxonomyLabelIndex = {
  jobFamily: {},
  role: {},
  companySize: {},
  region: {},
  employmentType: {},
  experienceLevel: {},
};

/**
 * Resolves one code. Falls back to the raw code when the taxonomy has no
 * entry — better a visible unknown code than a blank field.
 */
export function labelForCode(
  index: TaxonomyLabelIndex,
  kind: TaxonomyCodeKind,
  code: string | null | undefined,
): string | null {
  if (code === null || code === undefined || code === "") return null;
  return index[kind][code] ?? code;
}

export function labelsForCodes(
  index: TaxonomyLabelIndex,
  kind: TaxonomyCodeKind,
  codes: readonly string[],
): string[] {
  return codes.map((code) => index[kind][code] ?? code);
}
