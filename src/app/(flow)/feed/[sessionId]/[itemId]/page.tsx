import { JobDetailPageClient } from "@/features/job-feed/components/job-detail-page-client";
import { loadFeedViewContext } from "@/features/job-feed/lib/load-view-context";
import { buildSourceNameIndex } from "@/features/job-feed/lib/source-names";

interface JobDetailPageProps {
  params: Promise<{ sessionId: string; itemId: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { sessionId, itemId } = await params;
  const { labels, ingestionSources } = await loadFeedViewContext();

  return (
    <JobDetailPageClient
      sessionId={sessionId}
      itemId={itemId}
      context={{ labels, sources: buildSourceNameIndex(ingestionSources) }}
    />
  );
}
