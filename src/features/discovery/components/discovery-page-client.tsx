"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import { getDiscoveryAuthBoundaryState } from "../lib/discovery-auth-boundary-state";
import { DiscoveryScreen } from "./discovery-screen";

interface DiscoveryPageClientProps {
  sessionId: string;
}

export function DiscoveryPageClient({ sessionId }: DiscoveryPageClientProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const boundary = getDiscoveryAuthBoundaryState({
    isAuthLoading,
    hasUser: Boolean(user),
  });

  useEffect(() => {
    if (boundary.state === "redirect") {
      router.replace(`/login?redirect=${encodeURIComponent(`/discovery/${sessionId}`)}`);
    }
  }, [boundary.state, router, sessionId]);

  if (!boundary.canQuery) {
    return (
      <div
        className="ui-page ui-page-narrow flex flex-col gap-4"
        aria-label="인증 정보를 확인하는 중"
      >
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-4 h-28 w-full" />
        </div>
      </div>
    );
  }

  return <DiscoveryScreen sessionId={sessionId} />;
}
