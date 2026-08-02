import { z } from "zod";

/**
 * A taxonomy entry as `GET /taxonomy` returns it: `{ code, label }`.
 * The backend speaks in codes everywhere else (`SEOUL`, `FULL_TIME`, ...),
 * so this response is the only source of a Korean label for a code —
 * see src/lib/taxonomy/labels.ts for the lookup built on top of it.
 */
export const TaxonomyOptionSchema = z.object({
  code: z.string(),
  label: z.string(),
});
export type TaxonomyOption = z.infer<typeof TaxonomyOptionSchema>;

/**
 * A conversation choice chip. Deliberately not the same shape as
 * TaxonomyOption: a turn choice carries `value`, which may be a free-form
 * token (`__unsure__`, `Java/Spring`) rather than a taxonomy code.
 */
export const ChoiceOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

/**
 * Matching evidence attached to a scored job. `kind` drives icon + color;
 * never render `score` without at least one of these (see AGENTS.md #1).
 */
export const MatchReasonKindSchema = z.enum(["match", "caution", "gap"]);
export type MatchReasonKind = z.infer<typeof MatchReasonKindSchema>;

export const MatchReasonSchema = z.object({
  kind: MatchReasonKindSchema,
  text: z.string(),
  /** Criteria field this reason came from, e.g. "techStack". */
  field: z.string().optional(),
});
export type MatchReason = z.infer<typeof MatchReasonSchema>;

/**
 * Session lifecycle status. Single source of truth for the state machine —
 * see src/lib/session/route-for-status.ts for the status -> route mapping.
 * Mirrors the backend's SESSION_STATUSES.
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
