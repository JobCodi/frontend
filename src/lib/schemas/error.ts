import { z } from "zod";

/**
 * Backend error envelope. `details` carries field-level validation guidance
 * and is optional for domain errors that have no input field context.
 */
export const ApiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.object({ field: z.string().optional(), message: z.string() })).optional(),
  }),
});

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;
