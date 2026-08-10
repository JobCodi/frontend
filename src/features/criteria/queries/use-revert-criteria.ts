"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { CriteriaRevertResponseSchema } from "@/lib/schemas/criteria";

export function useRevertCriteria(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetVersion: number) =>
      apiPost(
        `/sessions/${sessionId}/criteria/revert`,
        CriteriaRevertResponseSchema,
        { targetVersion }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.criteria(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.criteriaHistory(sessionId),
      });
    },
  });
}
