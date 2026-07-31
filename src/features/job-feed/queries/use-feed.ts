"use client";

import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { FeedPageSchema, type FeedQueryParams } from "@/lib/schemas/feed";

function buildFeedPath(sessionId: string, params: FeedQueryParams, cursor: string | null): string {
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  query.set("limit", "20");
  query.set("sort", params.sort);
  query.set("minScore", String(params.minScore));
  return `/sessions/${sessionId}/feed?${query.toString()}`;
}

/**
 * GET /sessions/:id/feed — infinite query for pagination, `refetchInterval`
 * (function form) for the collecting-phase 2s poll. Never a useEffect
 * timer (Rules.md #5). Polling auto-stops once page 1's status leaves
 * "collecting", and is force-stopped after 60s regardless.
 *
 * Only the "ready" variant paginates; "collecting" and "failed" bodies
 * carry no cursor, so `getNextPageParam` stops there.
 */
export function useFeed(sessionId: string, params: FeedQueryParams) {
  const pollStartedAt = useRef<number | null>(null);

  return useInfiniteQuery({
    queryKey: queryKeys.feed(sessionId, params),
    queryFn: ({ pageParam }) => apiGet(buildFeedPath(sessionId, params, pageParam), FeedPageSchema),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.status === "ready" && lastPage.hasMore ? lastPage.nextCursor : undefined,
    refetchInterval: (query) => {
      const status = query.state.data?.pages[0]?.status;
      if (status !== "collecting") {
        pollStartedAt.current = null;
        return false;
      }
      if (pollStartedAt.current === null) {
        pollStartedAt.current = Date.now();
      }
      return Date.now() - pollStartedAt.current >= 60_000 ? false : 2000;
    },
  });
}
