import { z } from "zod";

export const ActiveProfileSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["collecting", "ready", "collection_failed"]),
});

export const ActiveProfileResponseSchema = z.object({
  profile: ActiveProfileSchema.nullable(),
});

export type ActiveProfileResponse = z.infer<typeof ActiveProfileResponseSchema>;
