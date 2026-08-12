import "server-only";

import { apiUrl } from "@/lib/config/env";

export const REFRESH_TOKEN_COOKIE = "jobcodi_refresh";
export const LOGOUT_BACKEND_TIMEOUT_MS = 2_000;

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth",
  };
}

export async function requestBackend(path: string, init: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}

export async function passthroughResponse(backendResponse: Response): Promise<Response> {
  const headers = new Headers();
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if ([204, 205, 304].includes(backendResponse.status)) {
    return new Response(null, { status: backendResponse.status, headers });
  }
  return new Response(await backendResponse.arrayBuffer(), {
    status: backendResponse.status,
    headers,
  });
}
