"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import { ApiError } from "@/lib/api/client";
import { routeForStatus } from "@/lib/session/route-for-status";
import { useSession } from "@/lib/session/use-session";
import { useFeed } from "../queries/use-feed";
import { useRefreshFeed } from "../queries/use-refresh-feed";
import { useFeedParams } from "../hooks/use-feed-params";
import { usePollingTimedOut } from "../hooks/use-polling-timed-out";
import { CollectingChecklist } from "./collecting-checklist";
import { FailureState } from "./failure-state";
import { ZeroResultState } from "./zero-result-state";
import { SortFilterBar } from "./sort-filter-bar";
import { JobList, FeedCardSkeleton } from "./job-list";

interface FeedScreenProps {
  sessionId: string;
}

export function FeedScreen({ sessionId }: FeedScreenProps) {
  const router = useRouter();
  const { params, setParams } = useFeedParams();
  const { data: session } = useSession(sessionId);
  const feed = useFeed(sessionId, params);
  const refreshFeed = useRefreshFeed(sessionId, params);

  const firstPage = feed.data?.pages[0];
  const status = firstPage?.status;
  const pollingTimedOut = usePollingTimedOut(status);

  // Session moved past collection entirely (e.g. abandoned) — re-route via
  // the single status -> route mapping rather than special-casing here.
  useEffect(() => {
    if (session && session.status !== "collecting" && session.status !== "ready" && session.status !== "collection_failed") {
      router.replace(routeForStatus(session.status, sessionId));
    }
  }, [session, sessionId, router]);

  if (feed.isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      </div>
    );
  }

  if (feed.isError || !firstPage) {
    const message = feed.error instanceof Error ? feed.error.message : undefined;
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <ErrorState title="공고를 불러오지 못했어요" description={message} onRetry={() => feed.refetch()} />
      </div>
    );
  }

  const allItems = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">공고 모아보기</p>
        <Link
          href={`/discovery/${sessionId}/criteria`}
          className="text-sm text-[var(--brand)] hover:underline"
        >
          조건 수정
        </Link>
      </div>

      {status === "collecting" ? (
        <>
          <CollectingChecklist sourceProgress={firstPage.sourceProgress} />
          {pollingTimedOut ? (
            <div className="flex flex-col items-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 text-center">
              <p className="text-sm text-[var(--text-muted)]">예상보다 오래 걸리네요.</p>
              <Button variant="secondary" onClick={() => feed.refetch()}>
                새로고침
              </Button>
            </div>
          ) : null}
        </>
      ) : status === "collection_failed" ? (
        <FailureState
          sessionId={sessionId}
          message={firstPage.message}
          retryable={firstPage.retryable}
          onRetry={() => refreshFeed.mutate()}
        />
      ) : allItems.length === 0 ? (
        <ZeroResultState sessionId={sessionId} />
      ) : (
        <>
          <SortFilterBar params={params} onChange={setParams} total={firstPage.total} />
          <JobList
            items={allItems}
            sessionId={sessionId}
            hasNextPage={feed.hasNextPage}
            isFetchingNextPage={feed.isFetchingNextPage}
            onLoadMore={() => feed.fetchNextPage()}
          />
        </>
      )}

      {refreshFeed.isError && refreshFeed.error instanceof ApiError && refreshFeed.error.status === 429 ? (
        <p role="alert" className="text-center text-sm text-[var(--text-muted)]">
          새로고침은 5분에 한 번만 할 수 있어요.
        </p>
      ) : null}
    </div>
  );
}
