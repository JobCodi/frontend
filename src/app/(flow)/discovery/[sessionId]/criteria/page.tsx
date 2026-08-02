import { redirect } from "next/navigation";
import { apiGet, ApiError } from "@/lib/api/client";
import { TaxonomySchema, EMPTY_TAXONOMY } from "@/lib/schemas/taxonomy";
import { CriteriaEnvelopeSchema } from "@/lib/schemas/criteria";
import { CriteriaScreen } from "@/features/criteria";

export const metadata = {
  title: "조건 확인 | JobCodi",
};

interface CriteriaPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CriteriaPage({ params }: CriteriaPageProps) {
  const { sessionId } = await params;

  const [taxonomyResult, criteriaResult] = await Promise.allSettled([
    apiGet("/taxonomy", TaxonomySchema, { next: { revalidate: 3600 } }),
    apiGet(`/sessions/${sessionId}/criteria`, CriteriaEnvelopeSchema, { cache: "no-store" }),
  ]);

  if (criteriaResult.status === "rejected") {
    const err = criteriaResult.reason;
    if (err instanceof ApiError && err.status === 404) {
      redirect("/session-expired");
    }
    // Backend unreachable or other failure — let it surface to the nearest
    // error.tsx (discovery/[sessionId]/error.tsx) instead of crashing SSR.
    throw err;
  }

  const taxonomy = taxonomyResult.status === "fulfilled" ? taxonomyResult.value : EMPTY_TAXONOMY;

  return (
    <CriteriaScreen
      sessionId={sessionId}
      taxonomy={taxonomy}
      initialCriteria={criteriaResult.value}
    />
  );
}
