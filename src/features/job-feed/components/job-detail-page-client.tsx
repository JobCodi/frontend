"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/feedback/error-state";
import { PageFrame } from "@/components/layout/page-frame";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import { formatJobDetailDocumentTitle } from "../lib/job-detail-document-title";
import { toJobView, type JobViewContext } from "../lib/to-job-view";
import { useJobDetail } from "../queries/use-job-detail";
import { JobDetail } from "./job-detail";

interface JobDetailPageClientProps {
  sessionId: string;
  itemId: string;
  context: JobViewContext;
}

export function JobDetailPageClient({ sessionId, itemId, context }: JobDetailPageClientProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !isAuthLoading && Boolean(user);
  const { data, error, isError, refetch } = useJobDetail(sessionId, itemId, isAuthenticated);

  useEffect(() => {
    document.title = formatJobDetailDocumentTitle(isError ? undefined : data?.posting);
  }, [data, isError]);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/feed/${sessionId}/${itemId}`)}`,
      );
      return;
    }
    if (error instanceof ApiError && error.code === "SESSION_NOT_FOUND") {
      router.replace("/session-expired");
    }
  }, [error, isAuthLoading, itemId, router, sessionId, user]);

  if (!isAuthenticated || (!data && !isError)) {
    return (
      <PageFrame size="narrow">
        <div className="flex flex-col gap-3" aria-label="공고 상세 정보를 불러오는 중">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </PageFrame>
    );
  }

  if (isError || !data) {
    return (
      <PageFrame size="narrow">
        <ErrorState
          title="공고 정보를 불러오지 못했어요"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame size="narrow">
      <Link
        href={`/feed/${sessionId}`}
        className="mb-4 inline-block text-sm text-[var(--brand)] hover:underline"
      >
        ← 목록으로
      </Link>
      <JobDetail job={toJobView(data, context)} />
    </PageFrame>
  );
}
