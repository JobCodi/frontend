"use client";

import { useParams } from "next/navigation";
import { RouteErrorBoundary } from "@/components/feedback/route-error-boundary";

export default function DiscoveryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ sessionId: string }>();
  return <RouteErrorBoundary error={error} reset={reset} sessionId={params.sessionId} />;
}
