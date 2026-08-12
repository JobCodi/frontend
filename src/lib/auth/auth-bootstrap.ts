import type { AuthResponse } from "@/lib/schemas/auth";

export type AuthBootstrapResult =
  | { status: "authenticated"; session: AuthResponse }
  | { status: "unauthenticated" };

/**
 * A page reload has no in-memory access token. Refresh is therefore the only
 * bootstrap source; its user payload avoids a second /auth/me request.
 */
export async function bootstrapAuthSession(
  refresh: () => Promise<AuthResponse>,
): Promise<AuthBootstrapResult> {
  try {
    const result = await refresh();
    return { status: "authenticated", session: result };
  } catch {
    return { status: "unauthenticated" };
  }
}
