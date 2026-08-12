import { beforeEach, describe, expect, it } from "vitest";
import { EMPTY_GOAL_INPUT, isGoalInputSubmittable } from "../types";
import { useGoalIntakeStore } from "./goal-intake-store";

describe("goal intake refined conditions", () => {
  beforeEach(() => {
    useGoalIntakeStore.getState().reset();
  });

  it("기본값과 기존 필수 제출 조건을 유지한다", () => {
    expect(EMPTY_GOAL_INPUT).toMatchObject({
      workModes: [],
      workScheduleFlags: [],
      exclusionFlags: [],
      includeStretchJobs: false,
    });

    expect(
      isGoalInputSubmittable({
        ...EMPTY_GOAL_INPUT,
        workModes: ["REMOTE"],
        workScheduleFlags: ["FLEXIBLE"],
        exclusionFlags: ["DISPATCH"],
        includeStretchJobs: true,
      }),
    ).toBe(false);

    expect(
      isGoalInputSubmittable({
        ...EMPTY_GOAL_INPUT,
        companySizes: ["startup"],
        jobFamily: "development",
        experienceLevel: "entry",
        selectedCrawlSites: ["work24"],
      }),
    ).toBe(true);
  });

  it("세부 조건 다중 선택값을 독립적으로 토글한다", () => {
    const store = useGoalIntakeStore.getState();

    store.toggleInArray("workModes", "REMOTE");
    store.toggleInArray("workScheduleFlags", "FLEXIBLE");
    store.toggleInArray("exclusionFlags", "DISPATCH");

    expect(useGoalIntakeStore.getState().goal).toMatchObject({
      workModes: ["REMOTE"],
      workScheduleFlags: ["FLEXIBLE"],
      exclusionFlags: ["DISPATCH"],
    });

    useGoalIntakeStore.getState().toggleInArray("workModes", "REMOTE");
    expect(useGoalIntakeStore.getState().goal.workModes).toEqual([]);
  });

  it("조건 차이 공고 포함 여부를 boolean으로 토글한다", () => {
    const store = useGoalIntakeStore.getState();

    store.setField("includeStretchJobs", true);
    expect(useGoalIntakeStore.getState().goal.includeStretchJobs).toBe(true);

    useGoalIntakeStore.getState().setField("includeStretchJobs", false);
    expect(useGoalIntakeStore.getState().goal.includeStretchJobs).toBe(false);
  });
});
