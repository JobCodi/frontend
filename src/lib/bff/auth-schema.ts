import "server-only";

import { z } from "zod";
import { UserSchema } from "@/lib/schemas/auth";

/** Backend-only credentials must not be imported by browser code. */
export const BackendAuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.string(),
  refreshExpiresAt: z.string(),
  user: UserSchema,
});
