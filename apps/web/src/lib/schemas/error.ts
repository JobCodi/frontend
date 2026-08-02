import { z } from "zod";

/**
 * Backend error envelope: { error: { code, message } }.
 * Every non-2xx response is expected to match this shape.
 */
export const ApiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ApiErrorBody = z.infer<typeof ApiErrorBodySchema>;
