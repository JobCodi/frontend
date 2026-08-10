"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CriteriaHistoryResponseSchema, type CriteriaHistoryResponse } from "@/lib/schemas/criteria";

export function useCriteriaHistory(sessionId: string) {
  return useQuery({
    queryKey: queryKeys.criteriaHistory(sessionId),
    queryFn: () => apiGet(`/sessions/${sessionId}/criteria/history`, CriteriaHistoryResponseSchema),
  });
}
