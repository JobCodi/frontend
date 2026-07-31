import { z } from "zod";
import { SessionStatusSchema, TaxonomyOptionSchema } from "./common";
import { CriteriaEnvelopeSchema } from "./criteria";

/**
 * A single AI-driven turn question. `fallback: true` means the LLM call
 * failed and this is a canned question — the UI must NOT visually
 * distinguish it (product.md §4.5), it's only used for the degraded-mode
 * banner on /criteria after too many fallbacks in a row.
 */
export const TurnQuestionSchema = z.object({
  turnIndex: z.number(),
  prompt: z.string(),
  choices: z.array(TaxonomyOptionSchema).optional().default([]),
  allowFreeText: z.boolean().optional().default(true),
  fallback: z.boolean().optional().default(false),
});
export type TurnQuestion = z.infer<typeof TurnQuestionSchema>;

/** One completed turn, used to render the collapsed conversation history. */
export const TurnHistoryEntrySchema = z.object({
  turnIndex: z.number(),
  prompt: z.string(),
  answerLabel: z.string(),
  fallback: z.boolean().optional().default(false),
  // Kept so the "edit last turn" flow (screens.md /discovery) can
  // reconstruct the original question without a dedicated rollback API.
  choices: z.array(TaxonomyOptionSchema).optional().default([]),
  allowFreeText: z.boolean().optional().default(true),
});
export type TurnHistoryEntry = z.infer<typeof TurnHistoryEntrySchema>;

/**
 * GET /sessions/:id and the POST /sessions response share this shape.
 * `turn` is present while status === "interviewing"; null/omitted once the
 * session has moved past the conversation stage.
 */
export const SessionSchema = z.object({
  sessionId: z.string(),
  status: SessionStatusSchema,
  turn: TurnQuestionSchema.nullable().optional(),
  remainingTurns: z.number().optional().default(0),
  history: z.array(TurnHistoryEntrySchema).optional().default([]),
  degraded: z.boolean().optional().default(false),
});
export type Session = z.infer<typeof SessionSchema>;

export const CreateSessionResponseSchema = SessionSchema;
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

/**
 * POST /sessions/:id/turns response. Discriminated on `status`:
 * either another turn to answer, or the interview is done and criteria
 * are ready for review.
 */
export const SubmitTurnResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("interviewing"),
    turn: TurnQuestionSchema,
    remainingTurns: z.number(),
  }),
  z.object({
    status: z.literal("criteria_ready"),
    criteria: CriteriaEnvelopeSchema,
  }),
]);
export type SubmitTurnResponse = z.infer<typeof SubmitTurnResponseSchema>;

export interface SubmitTurnRequest {
  answer?: string;
  choiceValue?: string;
}
