import type { FeedQueryParams } from "@/lib/schemas/feed";

/**
 * Single source of truth for TanStack Query cache keys (data-flow.md §3).
 * Never inline string literals for query keys in components.
 */
export const queryKeys = {
  taxonomy: () => ["taxonomy"] as const,
  session: (id: string) => ["session", id] as const,
  criteria: (id: string) => ["criteria", id] as const,
  feed: (id: string, params: FeedQueryParams) => ["feed", id, params] as const,
  job: (id: string) => ["job", id] as const,
  ingestionSources: () => ["ingestion-sources"] as const,
} as const;
