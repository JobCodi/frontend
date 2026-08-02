import { apiGet } from "@/lib/api/client";
import { TaxonomySchema } from "@/lib/schemas/taxonomy";
import { IngestionSourcesResponseSchema, type IngestionSource } from "@/lib/schemas/ingestion";
import {
  buildTaxonomyLabelIndex,
  EMPTY_TAXONOMY_LABEL_INDEX,
  type TaxonomyLabelIndex,
} from "@/lib/taxonomy/labels";

export interface FeedViewContext {
  labels: TaxonomyLabelIndex;
  ingestionSources: IngestionSource[];
}

/**
 * Server-side load of everything needed to turn codes and source ids into
 * Korean labels. Both responses are static enough to cache for an hour, and
 * both degrade to "show the raw code" rather than failing the feed —
 * the postings themselves are the page's real payload.
 */
export async function loadFeedViewContext(): Promise<FeedViewContext> {
  const [taxonomyResult, sourcesResult] = await Promise.allSettled([
    apiGet("/taxonomy", TaxonomySchema, { next: { revalidate: 3600 } }),
    apiGet("/ingestion/sources", IngestionSourcesResponseSchema, { next: { revalidate: 3600 } }),
  ]);

  return {
    labels:
      taxonomyResult.status === "fulfilled"
        ? buildTaxonomyLabelIndex(taxonomyResult.value)
        : EMPTY_TAXONOMY_LABEL_INDEX,
    ingestionSources: sourcesResult.status === "fulfilled" ? sourcesResult.value.sources : [],
  };
}
