"use client";

import Link from "next/link";
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
    <div className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-2 rounded-[var(--radius)] border border-[var(--brand-soft)] bg-[var(--brand-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--text)]">
          진행 중인 대화가 있어요
          {session.status === "interviewing" ? ` (${answered}/5)` : ` · ${stepLabelForDestination(destination)}`}
        </p>
      </div>
      <Button asChild size="sm">
        <Link href={destination}>이어서 하기 →</Link>
      </Button>
    </div>
  );
}
