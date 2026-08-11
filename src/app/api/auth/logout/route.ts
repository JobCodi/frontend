import { loggedOutResponse } from "@/lib/bff/auth";

export async function POST(): Promise<Response> {
  return loggedOutResponse();
}
