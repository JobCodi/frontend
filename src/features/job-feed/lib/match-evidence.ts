import type { MatchReason, MatchReasonKind } from "@/lib/schemas";

interface ScoreBreakdown {
  readonly techMatch: number;
  readonly roleMatch: number;
  readonly regionMatch: number;
  readonly freshness: number;
  readonly penalty: number;
}

interface MatchEvidenceInput {
  readonly breakdown: ScoreBreakdown;
  readonly reasons: readonly MatchReason[];
}

export interface MatchEvidenceContribution {
  readonly label: string;
  readonly value: number;
}

export interface MatchEvidenceGroup {
  readonly kind: MatchReasonKind;
  readonly title: string;
  readonly reasons: readonly MatchReason[];
}

const GROUPS: readonly { readonly kind: MatchReasonKind; readonly title: string }[] = [
  { kind: "match", title: "맞는 점" },
  { kind: "caution", title: "확인할 점" },
  { kind: "gap", title: "조건 차이" },
];

export function buildMatchEvidence({ breakdown, reasons }: MatchEvidenceInput): {
  readonly contributions: readonly MatchEvidenceContribution[];
  readonly groups: readonly MatchEvidenceGroup[];
} {
  return {
    contributions: [
      { label: "직무", value: breakdown.roleMatch },
      { label: "기술", value: breakdown.techMatch },
      { label: "지역", value: breakdown.regionMatch },
      { label: "최신성", value: breakdown.freshness },
      { label: "감점", value: breakdown.penalty },
    ],
    groups: GROUPS.map((group) => ({
      ...group,
      reasons: reasons.filter((reason) => reason.kind === group.kind),
    })).filter((group) => group.reasons.length > 0),
  };
}
