import { cookies } from "next/headers";
import { loggedOutResponse } from "@/lib/bff/auth";
import { LOGOUT_BACKEND_TIMEOUT_MS, REFRESH_TOKEN_COOKIE, requestBackend } from "@/lib/bff/backend";

export async function POST(): Promise<Response> {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), LOGOUT_BACKEND_TIMEOUT_MS);

  try {
    if (refreshToken) {
      await requestBackend("/auth/logout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        signal: abortController.signal,
      });
    }
  } catch {
    // Logout must not reveal refresh-token validity and always clears the local credential.
  } finally {
    clearTimeout(timeoutId);
  }
  return loggedOutResponse();
}
