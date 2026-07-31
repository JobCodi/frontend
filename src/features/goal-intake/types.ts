export interface GoalInput {
  companySizes: string[];
  jobFamily: string;
  roles: string[];
  experienceLevel: string;
  regions: string[];
  employmentTypes: string[];
  startTiming: string | null;
}

export const EMPTY_GOAL_INPUT: GoalInput = {
  companySizes: [],
  jobFamily: "",
  roles: [],
  experienceLevel: "",
  regions: [],
  employmentTypes: [],
  startTiming: null,
};

/** companySizes, jobFamily, experienceLevel are the only required fields (product.md §5). */
export function isGoalInputSubmittable(goal: GoalInput): boolean {
  return goal.companySizes.length > 0 && goal.jobFamily !== "" && goal.experienceLevel !== "";
}
