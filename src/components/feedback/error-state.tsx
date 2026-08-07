import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
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
      className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-white px-8 py-14 text-center shadow-[var(--shadow-card)]"
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100"
      >
        <AlertCircle className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[var(--text)]">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--text-muted)]">{description}</p>
        ) : null}
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button onClick={onRetry} className="rounded-xl shadow-sm">
            {retryLabel}
          </Button>
        ) : null}
        {secondaryAction}
      </div>
    </div>
  );
}
