import { z } from "zod";

/** GET /ingestion/sources — the publicly-safe subset shown on /about. */
export const IngestionSourceSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  active: z.boolean().optional().default(true),
});
export type IngestionSource = z.infer<typeof IngestionSourceSchema>;

export const IngestionSourcesResponseSchema = z.array(IngestionSourceSchema);
export type IngestionSourcesResponse = z.infer<
  typeof IngestionSourcesResponseSchema
>;
