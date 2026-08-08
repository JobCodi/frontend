"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routeForStatus } from "@/lib/session/route-for-status";
import { useActiveProfile } from "@/lib/profile/use-active-profile";

export function ActiveProfileGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const profile = useActiveProfile();

  useEffect(() => {
    if (profile.data?.profile === null || profile.data?.profile === undefined) return;
    const { sessionId, status } = profile.data.profile;
    router.replace(routeForStatus(status, sessionId));
  }, [profile.data, router]);

  if (profile.data?.profile !== null && profile.data?.profile !== undefined) {
    return <div className="ui-page ui-page-wide" aria-live="polite">마지막 공고를 불러오는 중이에요.</div>;
  }

  return children;
}
