import { cookies } from "next/headers";
import { forwardProxyRequest, USER_SESSION_COOKIE, passthroughResponse } from "@/lib/bff/backend";

export async function GET(request: Request): Promise<Response> {
  const token = (await cookies()).get(USER_SESSION_COOKIE)?.value;
  return passthroughResponse(await forwardProxyRequest(request, ["auth", "me"], token));
}
