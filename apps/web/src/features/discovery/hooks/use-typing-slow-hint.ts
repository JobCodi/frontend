"use client";

import { useEffect, useState } from "react";

/**
 * screens.md: typing indicator shows plain dots for 0-3s, then adds
 * "조금만 더요" after 3s. Pure UI timing — not a data-fetch effect.
 */
export function useTypingSlowHint(isPending: boolean): boolean {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isPending) return;
    const timer = setTimeout(() => setSlow(true), 3000);
    // Reset happens on cleanup (unmount, or isPending flipping back to
    // false/true) rather than synchronously in the effect body.
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [isPending]);

  return slow;
}
