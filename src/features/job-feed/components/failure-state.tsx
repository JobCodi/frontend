"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";
import type { FeedFailedPage } from "@/lib/schemas/feed";
import { SourceSummaryList } from "./source-summary-list";
import { Edit } from "lucide-react";

interface FailureStateProps {
  sessionId: string;
  page: FeedFailedPage;
  onRetry: () => void;
}

export function FailureState({ sessionId, page, onRetry }: FailureStateProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <ErrorState
          title="공고를 가져오지 못했어요"
          description={page.error.message}
          onRetry={page.retryable ? onRetry : undefined}
          secondaryAction={
            <Button variant="secondary" asChild className="gap-2 rounded-lg">
              <Link href={`/discovery/${sessionId}/criteria`}>
                <Edit className="h-4 w-4" />
                조건 수정하기
              </Link>
            </Button>
          }
        />
      </div>
      <SourceSummaryList sourceSummary={page.sourceSummary} />
    </div>
  );
}
