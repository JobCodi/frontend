import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { forwardProxyRequest, USER_SESSION_COOKIE, passthroughResponse } from "@/lib/bff/backend";

interface ProxyRouteContext {
  params: Promise<{ path: string[] }>;
}

async function proxy(request: Request, context: ProxyRouteContext): Promise<Response> {
  const { path } = await context.params;
  // Auth endpoints can return a backend accessToken, so they are reachable only
  // through the dedicated handlers that strip it before responding.
  if (path[0] === "auth") {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "찾을 수 없어요." } }, { status: 404 });
  }
  const token = (await cookies()).get(USER_SESSION_COOKIE)?.value;
  return passthroughResponse(await forwardProxyRequest(request, path, token));
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
