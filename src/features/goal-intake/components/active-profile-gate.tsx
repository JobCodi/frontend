"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routeForStatus } from "@/lib/session/route-for-status";
import { useActiveProfile } from "@/lib/profile/use-active-profile";
import { getActiveProfileGateState } from "../lib/active-profile-gate-state";

export function ActiveProfileGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const profile = useActiveProfile();
  const gateState = getActiveProfileGateState({
    isPending: profile.isPending,
    isError: profile.isError,
    profile: profile.data?.profile,
  });

  useEffect(() => {
    if (profile.data?.profile === null || profile.data?.profile === undefined) return;
    const { sessionId, status } = profile.data.profile;
    router.replace(routeForStatus(status, sessionId));
  }, [profile.data, router]);

  if (gateState === "loading" || gateState === "redirect") {
    return <div className="ui-page ui-page-wide" aria-live="polite">마지막 공고를 불러오는 중이에요.</div>;
  }

  if (gateState === "error") {
    return (
      <div className="ui-page ui-page-wide" role="alert">
        진행 중인 탐색을 확인하지 못했어요. 새로고침해 주세요.
      </div>
    );
  }

  return children;
}
