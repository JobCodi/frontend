"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { FeedItem } from "@/lib/schemas/feed";
import { filterRenderableFeedItems } from "../lib/filter-renderable-feed-items";
import { useInfiniteScrollSentinel } from "../hooks/use-infinite-scroll-sentinel";
import { toJobView, type JobViewContext } from "../lib/to-job-view";
import { JobCard } from "./job-card";

interface JobListProps {
  items: FeedItem[];
  context: JobViewContext;
  sessionId: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function JobList({
  items,
  context,
  sessionId,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: JobListProps) {
  const sentinelRef = useInfiniteScrollSentinel(onLoadMore, hasNextPage && !isFetchingNextPage);

  const renderable = filterRenderableFeedItems(items);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderable.map((item) => (
          <JobCard key={item.id} job={toJobView(item, context)} sessionId={sessionId} />
        ))}
      </div>

      {hasNextPage ? (
        <div ref={sentinelRef} className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2" aria-hidden="true">
          {isFetchingNextPage ? (
            <>
              <FeedCardSkeleton />
              <FeedCardSkeleton />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="mt-2 h-6 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-14 rounded-lg" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
