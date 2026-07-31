import { z } from "zod";
import { ChoiceOptionSchema, SessionStatusSchema } from "./common";
import { CriteriaVersionSchema } from "./criteria";

/**
 * The question currently awaiting an answer.
 *
 * Only ever arrives on a `POST /sessions` or `POST /sessions/:id/turns`
 * response: `GET /sessions/:id` returns answered turns only, so the pending
 * question cannot be re-fetched (see features/discovery/queries/use-pending-turn.ts).
 */
export const TurnQuestionSchema = z.object({
  index: z.number(),
  slot: z.string(),
  question: z.string(),
  choices: z.array(ChoiceOptionSchema),
  allowsFreeText: z.boolean(),
});
export type TurnQuestion = z.infer<typeof TurnQuestionSchema>;

/** One answered turn, used to render the collapsed conversation history. */
export const AnsweredTurnSchema = z.object({
  index: z.number(),
  slot: z.string(),
  question: z.string(),
  answer: z.string(),
});
export type AnsweredTurn = z.infer<typeof AnsweredTurnSchema>;

/** The goal form as the backend echoes it back on `GET /sessions/:id`. */
export const GoalInputSchema = z.object({
  companySizes: z.array(z.string()),
  jobFamily: z.string(),
  roles: z.array(z.string()),
  experienceLevel: z.string(),
  regions: z.array(z.string()),
  employmentTypes: z.array(z.string()),
  targetStartAt: z.string().nullable(),
});
export type GoalInputResponse = z.infer<typeof GoalInputSchema>;

/** `GET /sessions/:id`. Note: no pending question, no `degraded` flag. */
export const SessionSchema = z.object({
  sessionId: z.string(),
  status: SessionStatusSchema,
  goalInput: GoalInputSchema,
  turnIndex: z.number(),
  remainingTurns: z.number(),
  filledSlots: z.array(z.string()),
  turns: z.array(AnsweredTurnSchema),
  expiresAt: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;

/**
 * `POST /sessions` -> 201. A different shape from `GET /sessions/:id`:
 * it carries the first question and omits goalInput/turns.
 * `fallback: true` means the LLM was unavailable and the deterministic
 * question flow answered instead — the UI must not visually distinguish it
 * (product.md §4.5).
 */
export const CreateSessionResponseSchema = z.object({
  sessionId: z.string(),
  status: SessionStatusSchema,
  turn: TurnQuestionSchema,
  remainingTurns: z.number(),
  fallback: z.boolean().optional(),
});
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

/**
 * `POST /sessions/:id/turns`. Discriminated on `status`: either another
 * question, or the interview committed and criteria are ready for review.
 * `estimatedCount` is a sibling of `criteria`, not a field inside it.
 */
export const SubmitTurnResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("interviewing"),
    turn: TurnQuestionSchema,
    remainingTurns: z.number(),
  }),
  z.object({
    status: z.literal("criteria_ready"),
    criteria: CriteriaVersionSchema,
    estimatedCount: z.number(),
  }),
]);
export type SubmitTurnResponse = z.infer<typeof SubmitTurnResponseSchema>;

export interface SubmitTurnRequest {
  answer?: string;
  choiceValue?: string;
}
