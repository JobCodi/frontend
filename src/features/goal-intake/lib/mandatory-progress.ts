interface MandatoryGoalFields {
  companySizes: string[];
  jobFamily: string;
  experienceLevel: string;
  selectedCrawlSites: string[];
}

const MANDATORY_FIELD_COUNT = 4;

export interface MandatoryProgress {
  completed: number;
  total: number;
  percent: number;
}

export function getMandatoryProgress(goal: MandatoryGoalFields): MandatoryProgress {
  const completed = [
    goal.companySizes.length > 0,
    goal.jobFamily !== "",
    goal.experienceLevel !== "",
    goal.selectedCrawlSites.length > 0,
  ].filter(Boolean).length;
  const percent = Math.min(100, Math.max(0, (completed / MANDATORY_FIELD_COUNT) * 100));

  return { completed, total: MANDATORY_FIELD_COUNT, percent };
}
