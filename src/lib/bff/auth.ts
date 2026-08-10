import "server-only";

import { NextResponse } from "next/server";
import { AuthResponseSchema } from "@/lib/schemas/auth";
import { BackendAuthResponseSchema } from "./auth-schema";
import { USER_SESSION_COOKIE, passthroughResponse, sessionCookieOptions } from "./backend";

export async function authenticatedResponse(backendResponse: Response): Promise<Response> {
  if (!backendResponse.ok) {
    return passthroughResponse(backendResponse);
  }

  const backendPayload: unknown = await backendResponse.json();
  const parsed = BackendAuthResponseSchema.parse(backendPayload);
  const publicPayload = AuthResponseSchema.parse({ expiresAt: parsed.expiresAt, user: parsed.user });
  const response = NextResponse.json(publicPayload);
  response.cookies.set(USER_SESSION_COOKIE, parsed.accessToken, sessionCookieOptions());
  return response;
}

export function loggedOutResponse(): Response {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(USER_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
