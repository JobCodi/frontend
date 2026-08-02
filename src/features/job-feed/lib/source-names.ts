import type { IngestionSource, SourceSummaryEntry } from "@/lib/schemas";

/** Source id -> human name. Plain object so it can cross the RSC boundary. */
export type SourceNameIndex = Readonly<Record<string, string>>;

/**
 * Merges the two places a source's display name can come from. The feed's
 * own `sourceSummary` wins because it describes the run that produced these
 * items (and may contain pseudo-sources like `cache` that the catalog has no
 * entry for).
 */
export function buildSourceNameIndex(
  catalog: readonly IngestionSource[],
  summary: readonly SourceSummaryEntry[] = [],
): SourceNameIndex {
  return {
    ...Object.fromEntries(catalog.map((source) => [source.id, source.displayName])),
    ...Object.fromEntries(summary.map((entry) => [entry.sourceId, entry.displayName])),
  };
}

export function sourceName(index: SourceNameIndex, sourceId: string): string {
  return index[sourceId] ?? sourceId;
}
