import "server-only";

import { z } from "zod";
import { AuthResponseSchema } from "@/lib/schemas/auth";

/** Backend-only contract. Keep accessToken outside browser-importable auth schemas. */
export const BackendAuthResponseSchema = AuthResponseSchema.extend({
  accessToken: z.string(),
});
