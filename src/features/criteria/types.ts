import type { CriteriaFieldKey, CriteriaSourceOrigin } from "@/lib/schemas/criteria";

export type {
  CriteriaFieldKey,
  CriteriaPayload,
  CriteriaEnvelope,
  CriteriaVersion,
  CriteriaSources,
} from "@/lib/schemas/criteria";

export type CriteriaEditorType = "multi-chip" | "single-chip" | "tag-input" | "number" | "weights";

export const CRITERIA_FIELD_EDITOR: Record<CriteriaFieldKey, CriteriaEditorType> = {
  companySizes: "multi-chip",
  regions: "multi-chip",
  employmentTypes: "multi-chip",
  roles: "multi-chip",
  jobFamily: "single-chip",
  experienceLevel: "single-chip",
  techStack: "tag-input",
  keywords: "tag-input",
  excludeKeywords: "tag-input",
  salaryMin: "number",
  weights: "weights",
};

export const CRITERIA_FIELD_LABEL: Record<CriteriaFieldKey, string> = {
  companySizes: "기업 규모",
  jobFamily: "직군",
  roles: "세부 직무",
  experienceLevel: "경력 구분",
  regions: "희망 지역",
  employmentTypes: "고용 형태",
  techStack: "기술 스택",
  keywords: "포함 키워드",
  excludeKeywords: "제외 조건",
  salaryMin: "최소 연봉",
  weights: "정렬 우선순위",
};

export const SOURCE_ORIGIN_LABEL: Record<CriteriaSourceOrigin, string> = {
  form: "폼에서 입력",
  turn: "번째 답변", // prefixed with turnIndex by the caller, e.g. `1${label}`
  default: "기본값",
  manual: "직접 수정함",
};

/** Mirrors the backend's MAX_TECH_STACK / MAX_KEYWORDS / MAX_FREE_TEXT_LENGTH. */
export const TAG_FIELD_LIMITS: Partial<Record<CriteriaFieldKey, { maxItems: number; maxLength: number }>> = {
  techStack: { maxItems: 15, maxLength: 32 },
  keywords: { maxItems: 10, maxLength: 32 },
  excludeKeywords: { maxItems: 10, maxLength: 32 },
};
