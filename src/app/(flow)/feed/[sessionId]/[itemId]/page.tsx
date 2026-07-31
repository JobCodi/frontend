import { redirect } from "next/navigation";
import Link from "next/link";
import { apiGet, ApiError } from "@/lib/api/client";
import { FeedItemSchema, type FeedItem } from "@/lib/schemas/feed";
import { ErrorState } from "@/components/feedback/error-state";
import { JobDetail } from "@/features/job-feed";

interface JobDetailPageProps {
  params: Promise<{ sessionId: string; itemId: string }>;
}

type LoadResult =
  | { kind: "ok"; item: FeedItem }
  | { kind: "session-not-found" }
  | { kind: "error"; message?: string };

// See src/features/job-feed/queries/use-job-detail.ts for the same
// assumption: no dedicated single-item endpoint is documented, so a
// direct/refreshed load fetches this REST-shaped path directly.
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

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { sessionId, itemId } = await params;
  const result = await loadItem(sessionId, itemId);

  if (result.kind === "session-not-found") {
    redirect("/session-expired");
  }

  if (result.kind === "error") {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <ErrorState title="공고 정보를 불러오지 못했어요" description={result.message} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link
        href={`/feed/${sessionId}`}
        className="mb-4 inline-block text-sm text-[var(--brand)] hover:underline"
      >
        ← 목록으로
      </Link>
      <JobDetail item={result.item} />
    </div>
  );
}
