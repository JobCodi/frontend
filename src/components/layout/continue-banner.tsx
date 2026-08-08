"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContinueSession } from "@/lib/session/restore";
import { FLOW_STEPS } from "@/components/layout/step-progress";

function stepLabelForDestination(destination: string): string {
  if (destination.includes("/criteria")) return FLOW_STEPS[2].label;
  if (destination.startsWith("/discovery")) return FLOW_STEPS[1].label;
  if (destination.startsWith("/feed")) return FLOW_STEPS[3].label;
  return FLOW_STEPS[0].label;
}

export function ContinueBanner() {
  const { status, session, destination } = useContinueSession();

  if (status !== "found" || !destination || !session) return null;

  const remaining = session.remainingTurns ?? 0;
  const answered = Math.max(0, 5 - remaining);

  return (
    <div className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-[var(--brand)]/20 bg-gradient-to-r from-[var(--brand-soft)] to-[#f3e8ff] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--brand)] shadow-sm">
          <History className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">진행 중인 대화가 있어요</p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {session.status === "interviewing"
              ? `${answered}/5 턴 진행 중`
              : stepLabelForDestination(destination)}
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="rounded-lg shadow-sm">
        <Link href={destination}>이어서 하기 →</Link>
      </Button>
    </div>
  );
}
