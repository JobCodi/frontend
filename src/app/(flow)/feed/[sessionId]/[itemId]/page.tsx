import { redirect } from "next/navigation";
import Link from "next/link";
import { PageFrame } from "@/components/layout/page-frame";
import { apiGet, ApiError } from "@/lib/api/client";
import { FeedItemSchema, type FeedItem } from "@/lib/schemas/feed";
import { ErrorState } from "@/components/feedback/error-state";
import { JobDetail, toJobView } from "@/features/job-feed";
import { loadFeedViewContext } from "@/features/job-feed/lib/load-view-context";
import { buildSourceNameIndex } from "@/features/job-feed/lib/source-names";

interface JobDetailPageProps {
  params: Promise<{ sessionId: string; itemId: string }>;
}

type LoadResult =
  | { kind: "ok"; item: FeedItem }
  | { kind: "session-not-found" }
  | { kind: "error"; message?: string };

/**
 * Direct navigation / refresh path: the modal's client cache is empty here,
 * so the single-item endpoint is fetched server-side. Same shape as one
 * `feed.items[]` element (score + reasons + posting).
 */
async function loadItem(sessionId: string, itemId: string): Promise<LoadResult> {
  try {
    const item = await apiGet(`/sessions/${sessionId}/feed/${itemId}`, FeedItemSchema, {
      cache: "no-store",
    });
    return { kind: "ok", item };
  } catch (err) {
    if (err instanceof ApiError && err.code === "SESSION_NOT_FOUND") {
      return { kind: "session-not-found" };
    }
    return { kind: "error", message: err instanceof Error ? err.message : undefined };
  }
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { sessionId, itemId } = await params;
  const result = await loadItem(sessionId, itemId);
  if (result.kind !== "ok") {
    return { title: "공고 상세 | JobCodi" };
  }
  return { title: `${result.item.posting.title} · ${result.item.posting.companyName} | JobCodi` };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { sessionId, itemId } = await params;
  const [result, { labels, ingestionSources }] = await Promise.all([
    loadItem(sessionId, itemId),
    loadFeedViewContext(),
  ]);

  if (result.kind === "session-not-found") {
    redirect("/session-expired");
  }

  if (result.kind === "error") {
    return (
      <PageFrame size="narrow">
        <ErrorState title="공고 정보를 불러오지 못했어요" description={result.message} />
      </PageFrame>
    );
  }

  const job = toJobView(result.item, {
    labels,
    sources: buildSourceNameIndex(ingestionSources),
  });

  return (
    <PageFrame size="narrow">
      <Link
        href={`/feed/${sessionId}`}
        className="mb-4 inline-block text-sm text-[var(--brand)] hover:underline"
      >
        ← 목록으로
      </Link>
      <JobDetail job={job} />
    </PageFrame>
  );
}
