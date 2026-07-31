"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { SessionSchema } from "@/lib/schemas/session";

/** Shared GET /sessions/:id query — used by discovery, criteria and feed. */
export function useSession(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.session(sessionId),
    queryFn: () => apiGet(`/sessions/${sessionId}`, SessionSchema),
  });
}
