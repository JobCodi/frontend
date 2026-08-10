import "server-only";

import { apiUrl } from "@/lib/config/env";

export const USER_SESSION_COOKIE = "jobcodi_session";

const FORWARDED_CONTENT_HEADERS = ["content-type", "accept"] as const;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function requestBackend(path: string, init: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}

export async function forwardProxyRequest(
  request: Request,
  pathSegments: string[],
  accessToken: string | undefined,
): Promise<Response> {
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(apiUrl(`/${pathSegments.map(encodeURIComponent).join("/")}`));
  backendUrl.search = requestUrl.search;

  const headers = new Headers({
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  });
  for (const header of FORWARDED_CONTENT_HEADERS) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  return fetch(backendUrl.toString(), {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });
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
