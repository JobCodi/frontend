import { describe, expect, it } from "vitest";
import { getCriteriaAuthBoundaryState } from "./criteria-auth-boundary-state";

describe("getCriteriaAuthBoundaryState", () => {
  it("인증 확인 중에는 보호 쿼리를 실행하지 않는다", () => {
    expect(getCriteriaAuthBoundaryState({ isAuthLoading: true, hasUser: false })).toEqual({
      state: "loading",
      canQuery: false,
    });
  });

  it("비인증 사용자는 보호 쿼리 실행 전에 로그인으로 보낸다", () => {
    expect(getCriteriaAuthBoundaryState({ isAuthLoading: false, hasUser: false })).toEqual({
      state: "redirect",
      canQuery: false,
    });
  });

  it("인증 사용자에게만 보호 쿼리를 허용한다", () => {
    expect(getCriteriaAuthBoundaryState({ isAuthLoading: false, hasUser: true })).toEqual({
      state: "ready",
      canQuery: true,
    });
  });
});
