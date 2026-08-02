import { JobDetailModal } from "@/features/job-feed";
import { loadFeedViewContext } from "@/features/job-feed/lib/load-view-context";
import { buildSourceNameIndex } from "@/features/job-feed/lib/source-names";

interface InterceptedJobModalPageProps {
  params: Promise<{ sessionId: string; itemId: string }>;
}

export default async function InterceptedJobModalPage({ params }: InterceptedJobModalPageProps) {
  const { sessionId, itemId } = await params;
  const { labels, ingestionSources } = await loadFeedViewContext();

  return (
    <JobDetailModal
      sessionId={sessionId}
      itemId={itemId}
      context={{ labels, sources: buildSourceNameIndex(ingestionSources) }}
    />
  );
}
