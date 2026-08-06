"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { FeedItem } from "@/lib/schemas/feed";
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

  const renderable = items.filter((item) => {
    if (item.reasons.length === 0) {
      console.error(
        `[job-feed] item ${item.id} has empty reasons — API contract violation, skipping render.`,
      );
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {renderable.map((item) => (
          <JobCard key={item.id} job={toJobView(item, context)} sessionId={sessionId} />
        ))}
      </div>

      {hasNextPage ? (
        <div ref={sentinelRef} className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2" aria-hidden="true">
          {isFetchingNextPage ? <FeedCardSkeleton /> : null}
        </div>
      ) : null}
    </div>
  );
}

export function FeedCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}
