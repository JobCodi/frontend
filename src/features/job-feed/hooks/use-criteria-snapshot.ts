"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CriteriaEnvelopeSchema } from "@/lib/schemas/criteria";

/**
 * Read-only peek at the confirmed criteria, used only to power the 0-result
 * heuristic hint (screens.md /feed). Shares the ['criteria', id] cache key
 * with the criteria feature, so if the user came from /criteria this is
 * already warm.
 */
export function useCriteriaSnapshot(sessionId: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.criteria(sessionId),
    queryFn: () => apiGet(`/sessions/${sessionId}/criteria`, CriteriaEnvelopeSchema),
    enabled,
  });
}
