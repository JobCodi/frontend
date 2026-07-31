import { z } from "zod";

/**
 * A generic taxonomy option: { value, label }. Used for every flat choice
 * list the backend exposes (company sizes, regions, employment types, ...).
 */
export const TaxonomyOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});
export type TaxonomyOption = z.infer<typeof TaxonomyOptionSchema>;

/**
 * Matching evidence attached to a scored job. `kind` drives icon + color;
 * never render `score` without at least one of these (see AGENTS.md #1).
 */
export const MatchReasonKindSchema = z.enum(["match", "caution", "gap"]);
export type MatchReasonKind = z.infer<typeof MatchReasonKindSchema>;

export const MatchReasonSchema = z.object({
  kind: MatchReasonKindSchema,
  text: z.string(),
});
export type MatchReason = z.infer<typeof MatchReasonSchema>;

/**
 * Session lifecycle status. Single source of truth for the state machine —
 * see src/lib/session/route-for-status.ts for the status -> route mapping.
 */
export const SessionStatusSchema = z.enum([
  "interviewing",
  "criteria_ready",
  "collecting",
  "ready",
  "collection_failed",
  "abandoned",
]);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
