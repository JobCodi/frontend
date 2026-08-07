"use client";

import { useCountUp } from "../hooks/use-count-up";

export function EstimatedCount({ count }: { count: number }) {
  const display = useCountUp(count);
  return (
    <span aria-live="polite" className="inline-flex items-center gap-1">
      예상
      <strong className="rounded-lg bg-[var(--brand-soft)] px-1.5 py-0.5 font-semibold text-[var(--brand-strong)]">
        {display.toLocaleString("ko-KR")}
      </strong>
      건
    </span>
  );
}
