"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { ConfirmCriteriaResponseSchema } from "@/lib/schemas/criteria";
import type { Session } from "@/lib/schemas/session";

/** POST /sessions/:id/criteria/confirm -> 202 { status, feedId, criteriaVersion } -> /feed/:id */
export function useConfirmCriteria(sessionId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiPost(`/sessions/${sessionId}/criteria/confirm`, ConfirmCriteriaResponseSchema),
    onSuccess: (response) => {
      // The 202 already tells us the server moved to "collecting"; write it
      // into the cache before navigating, otherwise /feed reads the stale
      // "criteria_ready" and bounces straight back here.
      queryClient.setQueryData<Session>(queryKeys.session(sessionId), (old) =>
        old ? { ...old, status: response.status } : old,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionId) });
      router.push(`/feed/${sessionId}`);
    },
  });
}
