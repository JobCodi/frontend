/**
 * The `goalInput` body of `POST /sessions`. Field names and codes must
 * match the backend's goalInputSchema exactly — unknown keys are stripped
 * server-side, so a rename here silently drops the value.
 */
export const WORK_MODE_OPTIONS = [
  { code: "ONSITE", label: "출근" },
  { code: "HYBRID", label: "하이브리드" },
  { code: "REMOTE", label: "완전 원격" },
] as const;

export const WORK_SCHEDULE_FLAG_OPTIONS = [
  { code: "DAYTIME", label: "일반 주간" },
  { code: "FLEXIBLE", label: "유연근무 선호" },
  { code: "SHIFT_NIGHT", label: "교대·야간 가능" },
] as const;

export const EXCLUSION_FLAG_OPTIONS = [
  { code: "DISPATCH", label: "파견" },
  { code: "OUTSOURCED_ONSITE", label: "도급·고객사 상주" },
  { code: "SHIFT_NIGHT", label: "교대·야간" },
  { code: "RELOCATION", label: "지방 발령" },
] as const;

export interface GoalInput {
  companySizes: string[];
  jobFamily: string;
  roles: string[];
  experienceLevel: string;
  regions: string[];
  employmentTypes: string[];
  targetStartAt: string | null;
  workModes: string[];
  workScheduleFlags: string[];
  exclusionFlags: string[];
  includeStretchJobs: boolean;
  selectedCrawlSites: string[];
}

export const EMPTY_GOAL_INPUT: GoalInput = {
  companySizes: [],
  jobFamily: "",
  roles: [],
  experienceLevel: "",
  regions: [],
  employmentTypes: [],
  targetStartAt: null,
  workModes: [],
  workScheduleFlags: [],
  exclusionFlags: [],
  includeStretchJobs: false,
  selectedCrawlSites: [],
};

/** companySizes, jobFamily, experienceLevel, and at least one crawl site are required. */
export function isGoalInputSubmittable(goal: GoalInput): boolean {
  return (
    goal.companySizes.length > 0 &&
    goal.jobFamily !== "" &&
    goal.experienceLevel !== "" &&
    goal.selectedCrawlSites.length > 0
  );
}
