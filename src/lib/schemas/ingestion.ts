import { z } from "zod";
import { SourceKindSchema } from "./feed";

/** Compliance metadata the backend publishes per source. */
export const IngestionComplianceSchema = z.object({
  termsUrl: z.string().nullable(),
  respectsRobotsTxt: z.boolean(),
  requiresOptIn: z.boolean(),
  minIntervalMs: z.number(),
});
export type IngestionCompliance = z.infer<typeof IngestionComplianceSchema>;

export const IngestionSourceSchema = z.object({
  id: z.string(),
  kind: SourceKindSchema,
  displayName: z.string(),
  enabled: z.boolean(),
  disabledReason: z.string().nullable(),
  compliance: IngestionComplianceSchema,
});
export type IngestionSource = z.infer<typeof IngestionSourceSchema>;

/** `GET /ingestion/sources` — an envelope, not a bare array. */
export const IngestionSourcesResponseSchema = z.object({
  sources: z.array(IngestionSourceSchema),
});
export type IngestionSourcesResponse = z.infer<typeof IngestionSourcesResponseSchema>;
