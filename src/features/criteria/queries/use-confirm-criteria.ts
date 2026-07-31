"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { ConfirmCriteriaResponseSchema } from "@/lib/schemas/criteria";

/** POST /sessions/:id/criteria/confirm -> 202 { feedId } -> /feed/:id */
export function useConfirmCriteria(sessionId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiPost(`/sessions/${sessionId}/criteria/confirm`, ConfirmCriteriaResponseSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionId) });
      router.push(`/feed/${sessionId}`);
    },
  });
}
