"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";

interface FailureStateProps {
  sessionId: string;
  message?: string | null;
  retryable: boolean;
  onRetry: () => void;
}

export function FailureState({ sessionId, message, retryable, onRetry }: FailureStateProps) {
  return (
    <ErrorState
      title="공고를 가져오지 못했어요"
      description={message ?? "채용 사이트 응답이 원활하지 않습니다. 잠시 후 다시 시도해 주세요."}
      onRetry={retryable ? onRetry : undefined}
      secondaryAction={
        <Button variant="secondary" asChild>
          <Link href={`/discovery/${sessionId}/criteria`}>조건 수정하기</Link>
        </Button>
      }
    />
  );
}
