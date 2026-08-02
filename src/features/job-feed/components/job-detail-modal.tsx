"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { useJobDetail } from "../queries/use-job-detail";
import { toJobView, type JobViewContext } from "../lib/to-job-view";
import { JobDetail } from "./job-detail";

interface JobDetailModalProps {
  sessionId: string;
  itemId: string;
  context: JobViewContext;
}

/**
 * Rendered by the @modal intercepting route. Radix Dialog gives us the
 * focus trap + Esc-to-close for free (design-system.md §7 checklist item).
 */
export function JobDetailModal({ sessionId, itemId, context }: JobDetailModalProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useJobDetail(sessionId, itemId);

  function handleOpenChange(open: boolean) {
    if (!open) router.back();
  }

  const job = data ? toJobView(data, context) : null;

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <DialogTitle className="sr-only">공고 상세 정보를 불러오는 중</DialogTitle>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : isError || !job ? (
          <>
            <DialogTitle className="sr-only">공고 상세 정보를 불러오지 못했어요</DialogTitle>
            <ErrorState title="공고 정보를 불러오지 못했어요" onRetry={() => refetch()} />
          </>
        ) : (
          <>
            <DialogTitle className="sr-only">{job.title} 상세 정보</DialogTitle>
            <JobDetail job={job} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
