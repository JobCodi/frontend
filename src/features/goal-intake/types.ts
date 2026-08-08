/**
 * The `goalInput` body of `POST /sessions`. Field names and codes must
 * match the backend's goalInputSchema exactly — unknown keys are stripped
 * server-side, so a rename here silently drops the value.
 */
export interface GoalInput {
  companySizes: string[];
  jobFamily: string;
  roles: string[];
  experienceLevel: string;
  regions: string[];
  employmentTypes: string[];
  targetStartAt: string | null;
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
