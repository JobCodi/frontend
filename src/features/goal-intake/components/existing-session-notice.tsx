"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContinueSession } from "@/lib/session/restore";

/**
 * screens.md /start edge case: "이미 진행 중인 세션 존재 → 새로 시작하면
 * 진행 중인 대화가 사라집니다 확인". Shown above the form when a session id
 * is already in localStorage; user must explicitly acknowledge before the
 * blank form underneath becomes the obvious next step.
 */
export function ExistingSessionNotice() {
  const [dismissed, setDismissed] = useState(false);
  const { status, destination } = useContinueSession();

  if (dismissed || status !== "found" || !destination) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--brand-soft)] bg-[var(--brand-soft)] p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[var(--text)]">
        진행 중인 대화가 있어요. 새로 시작하면 이 대화는 사라져요.
      </p>
      <div className="flex shrink-0 gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link href={destination}>이어서 하기</Link>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          새로 시작하기
        </Button>
      </div>
    </div>
  );
}
