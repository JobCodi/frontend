import { create } from "zustand";
import { EMPTY_GOAL_INPUT, type GoalInput } from "../types";

/**
 * Pre-submit /start form state. Client-only — never touches TanStack Query
 * (data-flow.md §1). Cleared implicitly by navigating away.
 */
interface GoalIntakeStore {
  goal: GoalInput;
  setField: <K extends keyof GoalInput>(key: K, value: GoalInput[K]) => void;
  toggleInArray: (
    key:
      | "companySizes"
      | "roles"
      | "regions"
      | "employmentTypes"
      | "workModes"
      | "workScheduleFlags"
      | "exclusionFlags"
      | "selectedCrawlSites",
    value: string,
  ) => void;
  reset: () => void;
}

export const useGoalIntakeStore = create<GoalIntakeStore>((set) => ({
  goal: EMPTY_GOAL_INPUT,
  setField: (key, value) =>
    set((state) => ({ goal: { ...state.goal, [key]: value } })),
  toggleInArray: (key, value) =>
    set((state) => {
      const current = state.goal[key];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { goal: { ...state.goal, [key]: next } } as Partial<GoalIntakeStore>;
    }),
  reset: () => set({ goal: EMPTY_GOAL_INPUT }),
}));
