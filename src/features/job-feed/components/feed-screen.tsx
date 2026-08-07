"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, LayoutGrid, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { ApiError } from "@/lib/api/client";
import type { IngestionSource } from "@/lib/schemas/ingestion";
import type { SourceSummaryEntry } from "@/lib/schemas/feed";
import type { TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { routeForStatus } from "@/lib/session/route-for-status";
import { useSession } from "@/lib/session/use-session";
import { useFeed } from "../queries/use-feed";
import { useRefreshFeed } from "../queries/use-refresh-feed";
import { useFeedParams } from "../hooks/use-feed-params";
import { usePollingTimedOut } from "../hooks/use-polling-timed-out";
import { buildSourceNameIndex } from "../lib/source-names";
import type { JobViewContext } from "../lib/to-job-view";
import { CollectingChecklist } from "./collecting-checklist";
import { FailureState } from "./failure-state";
import { ZeroResultState } from "./zero-result-state";
import { SortFilterBar } from "./sort-filter-bar";
import { JobList, FeedCardSkeleton } from "./job-list";

interface FeedScreenProps {
  sessionId: string;
  labels: TaxonomyLabelIndex;
  ingestionSources: IngestionSource[];
}

export function FeedScreen({ sessionId, labels, ingestionSources }: FeedScreenProps) {
  const router = useRouter();
  const { params, setParams } = useFeedParams();
  const { data: session, isFetching: isFetchingSession } = useSession(sessionId);
  const feed = useFeed(sessionId, params);
  const refreshFeed = useRefreshFeed(sessionId, params);

  const firstPage = feed.data?.pages[0];
  const status = firstPage?.status;
  const pollingTimedOut = usePollingTimedOut(status);

  const sourceSummary = useMemo<SourceSummaryEntry[]>(
    () =>
      firstPage !== undefined && firstPage.status !== "collecting" ? firstPage.sourceSummary : [],
    [firstPage],
  );

  const context = useMemo<JobViewContext>(
    () => ({ labels, sources: buildSourceNameIndex(ingestionSources, sourceSummary) }),
    [labels, ingestionSources, sourceSummary],
  );

  useEffect(() => {
    if (isFetchingSession || !session) return;
    if (
      session.status !== "collecting" &&
      session.status !== "ready" &&
      session.status !== "collection_failed"
    ) {
      router.replace(routeForStatus(session.status, sessionId));
    }
  }, [session, isFetchingSession, sessionId, router]);

  const sessionNotFound = feed.error instanceof ApiError && feed.error.code === "SESSION_NOT_FOUND";

  useEffect(() => {
    if (sessionNotFound) {
      router.replace("/session-expired");
    }
  }, [sessionNotFound, router]);

  if (feed.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      </div>
    );
  }

  if (feed.isError || !firstPage) {
    if (sessionNotFound) {
      return null;
    }
    const message = feed.error instanceof Error ? feed.error.message : undefined;
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <ErrorState title="공고를 불러오지 못했어요" description={message} onRetry={() => feed.refetch()} />
      </div>
    );
  }

  const allItems =
    feed.data?.pages.flatMap((page) => (page.status === "ready" ? page.items : [])) ?? [];
  const totalCount = firstPage.status === "ready" ? firstPage.totalCount : undefined;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-elevated)]">
        <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-gradient-to-br from-white via-[var(--brand-soft)]/30 to-[#f3e8ff]/35 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
                Step 4 · Feed
              </p>
              <h1 className="mt-0.5 text-xl font-semibold text-[var(--text)] sm:text-2xl">
                맞춤 공고 피드
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                AI가 선별한 공고를 점수와 근거와 함께 확인해 보세요
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" className="gap-2 rounded-xl border-[var(--line)] bg-white shadow-sm">
            <Link href={`/discovery/${sessionId}/criteria`}>
              <Edit className="h-4 w-4" />
              조건 수정
            </Link>
          </Button>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          {firstPage.status === "collecting" ? (
            <>
              <CollectingChecklist progress={firstPage.progress} />
              {pollingTimedOut ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                  <p className="text-sm text-amber-800">예상보다 오래 걸리네요.</p>
                  <Button
                    variant="secondary"
                    onClick={() => feed.refetch()}
                    className="gap-2 rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                    새로고침
                  </Button>
                </div>
              ) : null}
            </>
          ) : firstPage.status === "failed" ? (
            <FailureState
              sessionId={sessionId}
              page={firstPage}
              onRetry={() => refreshFeed.mutate()}
            />
          ) : allItems.length === 0 ? (
            <ZeroResultState sessionId={sessionId} labels={labels} sourceSummary={sourceSummary} />
          ) : (
            <>
              <SortFilterBar params={params} onChange={setParams} total={totalCount} />
              <JobList
                items={allItems}
                context={context}
                sessionId={sessionId}
                hasNextPage={feed.hasNextPage}
                isFetchingNextPage={feed.isFetchingNextPage}
                onLoadMore={() => feed.fetchNextPage()}
              />
            </>
          )}

          {refreshFeed.isError &&
          refreshFeed.error instanceof ApiError &&
          refreshFeed.error.status === 429 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
              <p role="alert" className="text-sm text-amber-800">
                새로고침은 5분에 한 번만 할 수 있어요.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
