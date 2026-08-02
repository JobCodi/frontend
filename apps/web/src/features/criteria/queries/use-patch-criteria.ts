"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CriteriaEnvelopeSchema, type PatchCriteriaRequest } from "@/lib/schemas/criteria";

/**
 * PATCH /sessions/:id/criteria. Not retried (POST-like write). On success
 * the new envelope (including the recomputed estimatedCount) replaces the
 * cache directly — screens.md's count-up animation reads off that change.
 */
export function usePatchCriteria(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: PatchCriteriaRequest) =>
      apiPatch(`/sessions/${sessionId}/criteria`, CriteriaEnvelopeSchema, patch),
    onSuccess: (next) => {
      queryClient.setQueryData(queryKeys.criteria(sessionId), next);
    },
  });
}
