"use client";

import { useCountUp } from "../hooks/use-count-up";

export function EstimatedCount({ count }: { count: number }) {
  const display = useCountUp(count);
  return (
    <span aria-live="polite">
      예상 <strong className="font-semibold text-[var(--text)]">{display.toLocaleString("ko-KR")}</strong>건
    </span>
  );
}
