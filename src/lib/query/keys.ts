import type { FeedQueryParams } from "@/lib/schemas/feed";

/**
 * Single source of truth for TanStack Query cache keys (data-flow.md §3).
 * Never inline string literals for query keys in components.
 */
export const queryKeys = {
  taxonomy: () => ["taxonomy"] as const,
  session: (id: string) => ["session", id] as const,
  /**
   * The unanswered question. Cache-only: `GET /sessions/:id` returns
   * answered turns exclusively, so this is written by the create-session and
   * submit-turn responses and never re-fetched.
   */
  pendingTurn: (id: string) => ["pending-turn", id] as const,
  criteria: (id: string) => ["criteria", id] as const,
  feed: (id: string, params: FeedQueryParams) => ["feed", id, params] as const,
  job: (sessionId: string, itemId: string) => ["job", sessionId, itemId] as const,
  applications: () => ["applications"] as const,
  activeProfile: () => ["active-profile"] as const,
  deadlineReminders: () => ["deadline-reminders"] as const,
  dailyFeedSummary: () => ["daily-feed-summary"] as const,
  criteriaComparison: () => ["criteria-comparison"] as const,
  ingestionSources: () => ["ingestion-sources"] as const,
  adminMe: () => ["admin-me"] as const,
  adminSources: () => ["admin-sources"] as const,
  adminPlugins: () => ["admin-plugins"] as const,
  adminCrawlSites: () => ["admin-crawl-sites"] as const,
} as const;
