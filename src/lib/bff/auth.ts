import "server-only";

import { NextResponse } from "next/server";
import { AuthResponseSchema } from "@/lib/schemas/auth";
import { BackendAuthResponseSchema } from "./auth-schema";
import { REFRESH_TOKEN_COOKIE, passthroughResponse, refreshCookieOptions } from "./backend";

export async function authenticatedResponse(backendResponse: Response): Promise<Response> {
  if (!backendResponse.ok) {
    return passthroughResponse(backendResponse);
  }

  const backendPayload: unknown = await backendResponse.json();
  const parsed = BackendAuthResponseSchema.parse(backendPayload);
  const publicPayload = AuthResponseSchema.parse({
    accessToken: parsed.accessToken,
    expiresAt: parsed.expiresAt,
    user: parsed.user,
  });
  const response = NextResponse.json(publicPayload);
  response.cookies.set(REFRESH_TOKEN_COOKIE, parsed.refreshToken, refreshCookieOptions());
  return response;
}

export function loggedOutResponse(): Response {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", { ...refreshCookieOptions(), maxAge: 0 });
  return response;
}

export function expiredAuthResponse(): Response {
  const response = NextResponse.json(
    { error: { code: "UNAUTHORIZED", message: "인증이 만료되었어요." } },
    { status: 401 },
  );
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", { ...refreshCookieOptions(), maxAge: 0 });
  return response;
}

/**
 * 일시 장애에서 아직 유효할 수 있는 credential을 버리지 않고,
 * 백엔드 본문도 브라우저 어댑터로 노출하지 않는다.
 */
export function refreshUnavailableResponse(): Response {
  return NextResponse.json(
    { error: { code: "AUTH_REFRESH_UNAVAILABLE", message: "인증 갱신을 일시적으로 완료하지 못했어요." } },
    { status: 502 },
  );
}
