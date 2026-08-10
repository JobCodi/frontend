import type { FeedItem } from "@/lib/schemas/feed";

/** Keeps valid server order while isolating empty-evidence contract violations. */
export function filterRenderableFeedItems(items: readonly FeedItem[]): FeedItem[] {
  return items.filter((item) => {
    if (item.reasons.length > 0) return true;

    console.error("[job-feed] Feed item has empty reasons; skipping render.");
    return false;
  });
}
