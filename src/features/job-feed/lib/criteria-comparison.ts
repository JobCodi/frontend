interface DecisionCriteria {
  readonly roles: readonly string[];
  readonly regions: readonly string[];
  readonly employmentTypes: readonly string[];
  readonly techStack: readonly string[];
  readonly excludeKeywords: readonly string[];
}

export interface CriteriaChange {
  readonly label: string;
  readonly before: string;
  readonly after: string;
}

const FIELDS: readonly { readonly key: keyof DecisionCriteria; readonly label: string }[] = [
  { key: "roles", label: "희망 직무" },
  { key: "regions", label: "희망 지역" },
  { key: "employmentTypes", label: "고용형태" },
  { key: "techStack", label: "기술 스택" },
  { key: "excludeKeywords", label: "제외 조건" },
];

function display(values: readonly string[]): string {
  return values.length === 0 ? "없음" : values.join(" · ");
}

export function describeCriteriaChanges(current: DecisionCriteria, previous: DecisionCriteria): CriteriaChange[] {
  return FIELDS.flatMap(({ key, label }) => {
    const before = display(previous[key]);
    const after = display(current[key]);
    return before === after ? [] : [{ label, before, after }];
  });
}
