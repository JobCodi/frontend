import { apiGet, ApiError } from "@/lib/api/client";
import { TaxonomySchema, EMPTY_TAXONOMY } from "@/lib/schemas/taxonomy";
import { GoalIntakeForm } from "@/features/goal-intake";

export const metadata = {
  title: "목표 입력 | JobCodi",
};

async function loadTaxonomy() {
  try {
    const taxonomy = await apiGet("/taxonomy", TaxonomySchema, {
      next: { revalidate: 3600 },
    });
    return { taxonomy, failed: false };
  } catch (err) {
    // Backend may be unreachable during local/dev builds — degrade instead
    // of crashing the page (see task brief: don't let this fail the build).
    if (err instanceof ApiError || err instanceof Error) {
      return { taxonomy: EMPTY_TAXONOMY, failed: true };
    }
    throw err;
  }
}

export default async function StartPage() {
  const { taxonomy, failed } = await loadTaxonomy();

  return <GoalIntakeForm taxonomy={taxonomy} taxonomyFailed={failed} />;
}
