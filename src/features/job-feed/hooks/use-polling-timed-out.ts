"use client";

import { useEffect, useState } from "react";
import type { FeedCollectionStatus } from "@/lib/schemas/feed";

const POLL_CUTOFF_MS = 60_000;

/**
 * Tracks the 60s polling hard-cap independently from the refetchInterval
 * math (data-flow.md §4.4: "60초 상한은 별도로 센다"). Purely a UI timer —
 * doesn't fetch anything itself.
 */
export function usePollingTimedOut(status: FeedCollectionStatus | undefined): boolean {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (status !== "collecting") return;
    const timer = setTimeout(() => setTimedOut(true), POLL_CUTOFF_MS);
    // Reset on cleanup, not synchronously in the effect body.
    return () => {
      clearTimeout(timer);
      setTimedOut(false);
    };
  }, [status]);

  return timedOut;
}
