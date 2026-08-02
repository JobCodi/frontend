"use client";

import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { FeedItemSchema, type FeedItem, type FeedPage } from "@/lib/schemas/feed";

/**
 * Looks across every already-fetched feed page (any sort/minScore variant)
 * for this session to find `itemId` without a network call — covers the
 * common case where the user arrived via the feed list (the @modal
 * intercepting route always hits this path, since it only renders for
 * client-side navigations where the list is already in cache).
 */
function findCachedFeedItem(
  queryClient: QueryClient,
  sessionId: string,
  itemId: string,
): FeedItem | undefined {
  const feedQueries = queryClient.getQueriesData<{ pages: FeedPage[] }>({
    queryKey: ["feed", sessionId],
  });
  for (const [, data] of feedQueries) {
    const found = data?.pages
      .flatMap((page) => (page.status === "ready" ? page.items : []))
      .find((item) => item.id === itemId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Falls back to `GET /sessions/:id/feed/:itemId` for direct navigation and
 * page refresh, when the cache lookup above can't help. That endpoint —
 * not `GET /jobs/:id` — is the one to use here: `/jobs/:id` returns posting
 * metadata with no score or reasons, and this screen must show reasons.
 */
export function useJobDetail(sessionId: string, itemId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.job(itemId),
    queryFn: async () => {
      const cached = findCachedFeedItem(queryClient, sessionId, itemId);
      if (cached) return cached;
      return apiGet(`/sessions/${sessionId}/feed/${itemId}`, FeedItemSchema);
    },
    staleTime: 60_000,
  });
}
