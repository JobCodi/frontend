import { describe, expect, it } from "vitest";
import { getActiveProfileGateState } from "../lib/active-profile-gate-state";

describe("getActiveProfileGateState", () => {
  it("프로필을 불러오는 동안 폼을 열지 않는다", () => {
    expect(getActiveProfileGateState({ isPending: true, isError: false, profile: undefined })).toBe(
      "loading",
    );
  });

  it("프로필 조회가 실패하면 폼을 열지 않는다", () => {
    expect(getActiveProfileGateState({ isPending: false, isError: true, profile: undefined })).toBe(
      "error",
    );
  });

  it("활성 프로필이 없다는 응답을 받은 뒤에만 폼을 연다", () => {
    expect(getActiveProfileGateState({ isPending: false, isError: false, profile: null })).toBe(
      "form",
    );
  });

  it("활성 프로필이 있으면 해당 세션으로 이동한다", () => {
    expect(getActiveProfileGateState({ isPending: false, isError: false, profile: {} })).toBe(
      "redirect",
    );
  });
});
