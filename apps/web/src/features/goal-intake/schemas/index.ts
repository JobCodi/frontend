// Response validation for this feature's API calls lives in
// src/lib/schemas/session.ts (CreateSessionResponseSchema) and
// src/lib/schemas/taxonomy.ts (TaxonomySchema) — re-exported here so
// feature code can import from a single local path.
export { CreateSessionResponseSchema } from "@/lib/schemas/session";
export { TaxonomySchema } from "@/lib/schemas/taxonomy";
