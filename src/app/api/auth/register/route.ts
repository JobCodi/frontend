import { authenticatedResponse } from "@/lib/bff/auth";
import { requestBackend } from "@/lib/bff/backend";

export async function POST(request: Request): Promise<Response> {
  return authenticatedResponse(await requestBackend("/auth/register", {
    method: "POST",
    headers: { "content-type": request.headers.get("content-type") ?? "application/json" },
    body: await request.arrayBuffer(),
  }));
}
