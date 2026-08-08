"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/error-state";

interface RouteErrorBoundaryProps {
  error: (Error & { digest?: string }) | (Error & { code?: string; status?: number });
  reset: () => void;
  /** Where "SESSION_STATE_INVALID" should send the user while it re-resolves. */
  sessionId?: string;
}

/**
 * Shared error.tsx body for the flow routes. Branches on ApiError.code per
 * data-flow.md §8. `error` crossing the Server/Client boundary may lose its
 * prototype chain, so this checks for a `code` property rather than relying
 * on `instanceof ApiError`.
 */
export function RouteErrorBoundary({ error, reset, sessionId }: RouteErrorBoundaryProps) {
  const router = useRouter();
  const code = "code" in error ? (error as { code?: string }).code : undefined;

  useEffect(() => {
    if (code === "SESSION_NOT_FOUND") {
      router.replace("/session-expired");
    }
  }, [code, router]);

  if (code === "SESSION_NOT_FOUND") {
    return null;
  }

  if (code === "SESSION_STATE_INVALID" && sessionId) {
    return (
      <div className="ui-page ui-page-narrow">
        <ErrorState
          title="화면을 다시 맞추고 있어요"
          description="진행 상황이 바뀌어서 알맞은 화면으로 다시 안내할게요."
          onRetry={reset}
        />
      </div>
    );
  }

  if (code === "AI_PROVIDER_UNAVAILABLE") {
    return (
      <div className="ui-page ui-page-narrow">
        <ErrorState
          title="AI 응답이 불안정해요"
          description="잠시 후 다시 시도해 주세요. 입력하신 정보는 남아 있어요."
          onRetry={reset}
        />
      </div>
    );
  }

  return (
    <div className="ui-page ui-page-narrow">
      <ErrorState
        title="문제가 발생했어요"
        description={error.message || "잠시 후 다시 시도해 주세요."}
        onRetry={reset}
        secondaryAction={
          <Button variant="secondary" asChild>
            <Link href="/">처음으로</Link>
          </Button>
        }
      />
    </div>
  );
}
