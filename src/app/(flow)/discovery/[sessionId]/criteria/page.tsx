import { apiGet } from "@/lib/api/client";
import { TaxonomySchema, EMPTY_TAXONOMY } from "@/lib/schemas/taxonomy";
import { CriteriaPageClient } from "@/features/criteria/components/criteria-page-client";

export const metadata = {
  title: "조건 확인 | JobCodi",
};

interface CriteriaPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CriteriaPage({ params }: CriteriaPageProps) {
  const { sessionId } = await params;

  const taxonomy = await apiGet(
    "/taxonomy",
    TaxonomySchema,
    { next: { revalidate: 3600 } },
  ).catch(() => EMPTY_TAXONOMY);

  return <CriteriaPageClient sessionId={sessionId} taxonomy={taxonomy} />;
}
