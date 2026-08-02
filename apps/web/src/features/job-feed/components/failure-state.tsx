"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import type { FeedFailedPage } from "@/lib/schemas/feed";
import { SourceSummaryList } from "./source-summary-list";

interface FailureStateProps {
  sessionId: string;
  page: FeedFailedPage;
  onRetry: () => void;
}

export function FailureState({ sessionId, page, onRetry }: FailureStateProps) {
  return (
    <div className="flex flex-col gap-4">
      <ErrorState
        title="공고를 가져오지 못했어요"
        description={page.error.message}
        onRetry={page.retryable ? onRetry : undefined}
        secondaryAction={
          <Button variant="secondary" asChild>
            <Link href={`/discovery/${sessionId}/criteria`}>조건 수정하기</Link>
          </Button>
        }
      />
      <SourceSummaryList sourceSummary={page.sourceSummary} />
    </div>
  );
}
