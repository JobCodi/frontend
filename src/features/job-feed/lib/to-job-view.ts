import type { FeedItem, MatchReason } from "@/lib/schemas";
import { labelForCode, labelsForCodes, type TaxonomyLabelIndex } from "@/lib/taxonomy/labels";
import { sourceName, type SourceNameIndex } from "./source-names";

/**
 * The flat, already-labelled shape the feed UI renders.
 *
 * The API item is nested (`{ id, rank, score, reasons, posting }`) and
 * carries raw codes; rather than teaching every component about both, the
 * DTO is mapped here once, at the edge of the feature.
 */
export interface JobView {
  id: string;
  postingId: string;
  preference: "saved" | "excluded" | "none";
  title: string;
  companyName: string;
  score: number;
  scoreBreakdown: FeedItem["scoreBreakdown"];
  reasons: MatchReason[];
  employmentTypeLabel: string | null;
  companySizeLabel: string | null;
  companySizeInferred: boolean;
  regionLabel: string | null;
  experienceLabel: string | null;
  techStack: string[];
  salaryText: string | null;
  postedAt: string | null;
  closesAt: string | null;
  isRolling: boolean;
  url: string;
  sourceLabel: string;
  /** Other sources the same posting was found on. Ids only — no URLs. */
  alsoFoundOnLabels: string[];
}

export interface JobViewContext {
  labels: TaxonomyLabelIndex;
  sources: SourceNameIndex;
}

export function toJobView(item: FeedItem, context: JobViewContext): JobView {
  const { posting } = item;
  const regionLabel = labelForCode(context.labels, "region", posting.regionCode);
  const experienceLabels = labelsForCodes(
    context.labels,
    "experienceLevel",
    posting.experienceLevels,
  );

  return {
    id: item.id,
    postingId: posting.id,
    preference: item.preference,
    title: posting.title,
    companyName: posting.companyName,
    score: item.score,
    scoreBreakdown: item.scoreBreakdown,
    reasons: item.reasons,
    employmentTypeLabel: labelForCode(context.labels, "employmentType", posting.employmentType),
    companySizeLabel: labelForCode(context.labels, "companySize", posting.companySize),
    companySizeInferred: posting.companySizeInferred,
    regionLabel:
      regionLabel !== null && posting.regionDetail !== null
        ? `${regionLabel} ${posting.regionDetail}`
        : regionLabel,
    experienceLabel: experienceLabels.length > 0 ? experienceLabels.join(" · ") : null,
    techStack: posting.techStack,
    salaryText: posting.salaryText,
    postedAt: posting.postedAt,
    closesAt: posting.closesAt,
    isRolling: posting.isRolling,
    url: posting.url,
    sourceLabel: sourceName(context.sources, posting.sourceId),
    alsoFoundOnLabels: posting.alsoFoundOn.map((id) => sourceName(context.sources, id)),
  };
}
