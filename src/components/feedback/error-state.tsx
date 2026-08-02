import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: ReactNode;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "다시 시도",
  secondaryAction,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center"
    >
      <div aria-hidden="true" className="text-3xl">
        😔
      </div>
      <p className="text-[15px] font-medium text-[var(--text)]">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
        {secondaryAction}
      </div>
    </div>
  );
}
