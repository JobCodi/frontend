import { cookies } from "next/headers";
import { authenticatedResponse, expiredAuthResponse, refreshUnavailableResponse } from "@/lib/bff/auth";
import { REFRESH_TOKEN_COOKIE, requestBackend } from "@/lib/bff/backend";

export async function POST(): Promise<Response> {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) return expiredAuthResponse();

  try {
    const response = await requestBackend("/auth/refresh", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.status === 401 || response.status === 403) return expiredAuthResponse();
    if (!response.ok) return refreshUnavailableResponse();
    const authenticated = await authenticatedResponse(response);
    return authenticated;
  } catch {
    return refreshUnavailableResponse();
  }
}
