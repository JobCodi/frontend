import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(80),
});

export type User = z.infer<typeof UserSchema>;

/** Browser-safe auth payload. The short-lived access token remains in JS memory only. */
export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string(),
  user: UserSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const MeResponseSchema = z.object({
  user: UserSchema,
});

export type MeResponse = z.infer<typeof MeResponseSchema>;
