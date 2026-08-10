"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import type { Taxonomy } from "@/lib/schemas/taxonomy";
import { getCriteriaAuthBoundaryState } from "../lib/criteria-auth-boundary-state";
import { CriteriaScreen } from "./criteria-screen";

interface CriteriaPageClientProps {
  sessionId: string;
  taxonomy: Taxonomy;
}

export function CriteriaPageClient({ sessionId, taxonomy }: CriteriaPageClientProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const boundary = getCriteriaAuthBoundaryState({
    isAuthLoading,
    hasUser: Boolean(user),
  });

  useEffect(() => {
    if (boundary.state === "redirect") {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/discovery/${sessionId}/criteria`)}`,
      );
    }
  }, [boundary.state, router, sessionId]);

  if (!boundary.canQuery) {
    return (
      <div
        className="ui-page ui-page-narrow flex flex-col gap-4"
        aria-label="인증 정보를 확인하는 중"
      >
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="mt-4 h-40 w-full" />
        </div>
      </div>
    );
  }

  return <CriteriaScreen sessionId={sessionId} taxonomy={taxonomy} />;
}
