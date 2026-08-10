import type { JobPosting } from "@/lib/schemas/feed";

export const JOB_DETAIL_FALLBACK_TITLE = "공고 상세 | JobCodi";

export function formatJobDetailDocumentTitle(
  posting?: Pick<JobPosting, "title" | "companyName">,
) {
  if (!posting) return JOB_DETAIL_FALLBACK_TITLE;

  return `${posting.title} · ${posting.companyName} | JobCodi`;
}
