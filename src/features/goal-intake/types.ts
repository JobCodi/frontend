export interface GoalInput {
  companySizes: string[];
  jobFamily: string;
  roles: string[];
  experienceLevel: string;
  regions: string[];
  employmentTypes: string[];
  selectedCrawlSites: string[];
}

export const EMPTY_GOAL_INPUT: GoalInput = {
  companySizes: [],
  jobFamily: "",
  roles: [],
  experienceLevel: "",
  regions: [],
  employmentTypes: [],
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
