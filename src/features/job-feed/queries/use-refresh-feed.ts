"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { RefreshFeedResponseSchema, type FeedQueryParams } from "@/lib/schemas/feed";

/** POST /sessions/:id/feed/refresh — rate-limited to once per 5 min (429). */
export function useRefreshFeed(sessionId: string, params: FeedQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiPost(`/sessions/${sessionId}/feed/refresh`, RefreshFeedResponseSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feed(sessionId, params) });
    },
  });
}
